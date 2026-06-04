"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

export type CertItem = {
  issuer: string;
  issuerLogo: string;
  title: string;
  date: string; // YYYY-MM-DD
  file: string;
  hours?: string;
};

const MONTHS = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];
function formatDate(iso: string): string {
  const [y, m] = iso.split("-");
  return `${MONTHS[parseInt(m, 10) - 1]} ${y}`;
}

type Geom = {
  left: number;
  top: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
};

type Shard = {
  id: number;
  left: number;
  top: number;
  size: number;
  dx: number;
  dy: number;
  rot: number;
  clip: number;
};

const SHATTER_SPEED = 7; // umbral de velocidad de impacto para romper
const SHARDS_PER_CARD = 12;
const SHARD_CLIPS = [
  "polygon(0 0, 100% 20%, 70% 100%, 15% 75%)",
  "polygon(20% 0, 100% 40%, 80% 100%, 0 60%)",
  "polygon(0 10%, 90% 0, 100% 80%, 30% 100%)",
];

let shardSeq = 0;

export function CertShatter({ items }: { items: CertItem[] }) {
  const [mode, setMode] = useState<"idle" | "destroy">("idle");
  const [containerH, setContainerH] = useState<number | null>(null);
  const [broken, setBroken] = useState<Set<number>>(() => new Set());
  const [shards, setShards] = useState<Shard[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const geomRef = useRef<Geom[]>([]);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  // Sonido de vidrio roto sintetizado (sin assets): ráfaga de ruido filtrada.
  const playShatter = useCallback(() => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return;
      const ac = audioRef.current ?? (audioRef.current = new Ctx());
      const dur = 0.22;
      const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.6);
      }
      const src = ac.createBufferSource();
      src.buffer = buffer;
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2600;
      const gain = ac.createGain();
      gain.gain.value = 0.22;
      src.connect(hp);
      hp.connect(gain);
      gain.connect(ac.destination);
      src.start();
    } catch {
      /* sonido es best-effort */
    }
  }, []);

  const enterDestroy = useCallback(() => {
    const container = containerRef.current;
    if (!container || mode === "destroy") return;
    const crect = container.getBoundingClientRect();
    const geom: Geom[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) {
        geom[i] = { left: 0, top: 0, width: 0, height: 0, cx: 0, cy: 0 };
        return;
      }
      const r = el.getBoundingClientRect();
      const left = r.left - crect.left;
      const top = r.top - crect.top;
      geom[i] = {
        left,
        top,
        width: r.width,
        height: r.height,
        cx: left + r.width / 2,
        cy: top + r.height / 2,
      };
    });
    geomRef.current = geom;
    setContainerH(crect.height);
    setBroken(new Set());
    setShards([]);
    setMode("destroy");
  }, [mode]);

  const repair = useCallback(() => {
    cardRefs.current.forEach((el) => {
      if (el) el.style.transform = "";
    });
    setShards([]);
    setBroken(new Set());
    setContainerH(null);
    setMode("idle");
  }, []);

  const handleCardClick = useCallback(
    (e: React.MouseEvent, href: string) => {
      e.preventDefault();
      if (mode === "destroy") return; // en destrucción el click no navega; matter arrastra
      if (e.detail >= 3) {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        enterDestroy();
        return;
      }
      if (e.detail === 1) {
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(
          () => window.open(href, "_blank", "noopener,noreferrer"),
          320,
        );
      } else if (clickTimer.current) {
        clearTimeout(clickTimer.current); // detail === 2: cancela el abrir pendiente
      }
    },
    [mode, enterDestroy],
  );

  // Mundo de física matter.js — solo vive mientras mode === "destroy".
  useEffect(() => {
    if (mode !== "destroy") return;
    let cancelled = false;
    const cleanups: (() => void)[] = [];

    (async () => {
      const mod = (await import("matter-js")) as unknown as {
        default?: typeof import("matter-js");
      } & typeof import("matter-js");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Matter: any = mod.default ?? mod;
      if (cancelled) return;
      const container = containerRef.current;
      if (!container) return;

      const W = container.clientWidth;
      const H = containerH ?? container.clientHeight;
      const geom = geomRef.current;
      const { Engine, Runner, Bodies, Composite, Mouse, MouseConstraint, Events } =
        Matter;

      const engine = Engine.create();
      engine.gravity.y = 1;

      const t = 240;
      const wallOpts = { isStatic: true, label: "wall", restitution: 0.4 };
      const walls = [
        Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, wallOpts),
        Bodies.rectangle(W / 2, -t / 2, W + t * 2, t, wallOpts),
        Bodies.rectangle(-t / 2, H / 2, t, H + t * 2, wallOpts),
        Bodies.rectangle(W + t / 2, H / 2, t, H + t * 2, wallOpts),
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodies: any[] = [];
      geom.forEach((g, i) => {
        if (!g.width) {
          bodies[i] = null;
          return;
        }
        bodies[i] = Bodies.rectangle(g.cx, g.cy, g.width, g.height, {
          restitution: 0.45,
          friction: 0.3,
          frictionAir: 0.015,
          chamfer: { radius: 10 },
          label: `cert-${i}`,
        });
      });

      const mouse = Mouse.create(container);
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });

      Composite.add(engine.world, [...walls, ...bodies.filter(Boolean), mc]);

      const runner = Runner.create();
      Runner.run(runner, engine);

      // Sincroniza cada tarjeta DOM con su cuerpo físico cada frame.
      const onAfter = () => {
        for (let i = 0; i < bodies.length; i++) {
          const body = bodies[i];
          const el = cardRefs.current[i];
          const g = geom[i];
          if (!body || !el || !g) continue;
          el.style.transform = `translate(${body.position.x - g.cx}px, ${
            body.position.y - g.cy
          }px) rotate(${body.angle}rad)`;
        }
      };
      Events.on(engine, "afterUpdate", onAfter);

      // Deja que caigan/asienten ~750ms antes de armar el shatter,
      // para que el impacto contra el piso no rompa todo de golpe.
      let armed = false;
      const armTimer = setTimeout(() => {
        armed = true;
      }, 750);

      const localBroken = new Set<number>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doShatter = (i: number, body: any) => {
        if (i < 0 || Number.isNaN(i) || localBroken.has(i)) return;
        localBroken.add(i);
        Composite.remove(engine.world, body);
        bodies[i] = null;
        const g = geom[i];
        if (!g) return;
        const newShards: Shard[] = [];
        for (let s = 0; s < SHARDS_PER_CARD; s++) {
          const ang = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 150;
          newShards.push({
            id: shardSeq++,
            left: body.position.x - g.width / 2 + Math.random() * g.width,
            top: body.position.y - g.height / 2 + Math.random() * g.height,
            size: 14 + Math.random() * 30,
            dx: Math.cos(ang) * dist,
            dy: Math.sin(ang) * dist - 50,
            rot: (Math.random() * 2 - 1) * 260,
            clip: s % SHARD_CLIPS.length,
          });
        }
        setShards((prev) => [...prev, ...newShards]);
        setBroken((prev) => {
          const n = new Set(prev);
          n.add(i);
          return n;
        });
        playShatter();
        const ids = new Set(newShards.map((sh) => sh.id));
        setTimeout(
          () => setShards((prev) => prev.filter((sh) => !ids.has(sh.id))),
          950,
        );
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onCollide = (evt: any) => {
        if (!armed) return;
        for (const pair of evt.pairs) {
          const a = pair.bodyA;
          const b = pair.bodyB;
          const aCert = typeof a.label === "string" && a.label.startsWith("cert-");
          const bCert = typeof b.label === "string" && b.label.startsWith("cert-");
          if (!aCert || !bCert) continue; // solo choques certificado-certificado
          if (Math.max(a.speed, b.speed) < SHATTER_SPEED) continue;
          doShatter(parseInt(a.label.slice(5), 10), a);
          doShatter(parseInt(b.label.slice(5), 10), b);
        }
      };
      Events.on(engine, "collisionStart", onCollide);

      cleanups.push(() => {
        clearTimeout(armTimer);
        Events.off(engine, "afterUpdate", onAfter);
        Events.off(engine, "collisionStart", onCollide);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        if (typeof Mouse.clearSourceEvents === "function") {
          Mouse.clearSourceEvents(mouse);
        }
      });
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, [mode, containerH, playShatter]);

  return (
    <>
      {mode === "destroy" && (
        <div
          className="mb-6 flex items-center justify-between gap-4 rounded-xl px-4 py-3"
          style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
        >
          <p
            className="text-xs md:text-sm font-mono uppercase tracking-[0.12em]"
            style={{ color: "var(--fg)" }}
          >
            🔨 Modo destrucción — arrástralos y estréllalos
          </p>
          <button
            type="button"
            onClick={repair}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-mono uppercase tracking-[0.2em] transition-colors hover:opacity-80"
            style={{ border: "1px solid var(--circle)", color: "var(--circle)" }}
          >
            Reparar
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        className={cn("relative", mode === "destroy" && "cert-destroy-mode")}
        style={mode === "destroy" && containerH ? { height: containerH } : undefined}
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map((cert, i) => {
            const g = geomRef.current[i];
            const isBroken = broken.has(i);
            return (
              <li
                key={cert.file}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className={cn(mode === "destroy" && "cert-body")}
                style={
                  mode === "destroy" && g
                    ? {
                        left: g.left,
                        top: g.top,
                        width: g.width,
                        height: g.height,
                        opacity: isBroken ? 0 : 1,
                        transition: "opacity 0.12s ease",
                      }
                    : undefined
                }
              >
                <a
                  href={cert.file}
                  onClick={(e) => handleCardClick(e, cert.file)}
                  draggable={false}
                  className="cert-card group relative flex h-full flex-col rounded-2xl p-5 md:p-6 select-none transition-all duration-300 hover:-translate-y-0.5"
                  style={{ cursor: mode === "destroy" ? "grab" : "pointer" }}
                  aria-label={`${cert.title} — ${cert.issuer} — abrir certificado`}
                >
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="mb-5 flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-white"
                        style={{ borderColor: "var(--border)" }}
                      >
                        <img
                          src={cert.issuerLogo}
                          alt={cert.issuer}
                          draggable={false}
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold tracking-wide">
                          {cert.issuer}
                        </span>
                        <span
                          className="text-[10px] font-mono uppercase tracking-[0.2em]"
                          style={{ color: "var(--muted)" }}
                        >
                          {formatDate(cert.date)}
                          {cert.hours ? ` · ${cert.hours}` : ""}
                        </span>
                      </div>
                    </div>

                    <h3
                      className="mb-6 text-lg md:text-xl font-normal italic leading-snug"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {cert.title}
                    </h3>

                    <div
                      className="mt-auto flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em]"
                      style={{ color: "var(--circle, #1f5fa4)" }}
                    >
                      <span>{mode === "destroy" ? "Arrástrame" : "Ver certificado"}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-60 transition-all group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>

        {shards.map((s) => (
          <motion.span
            key={s.id}
            className="glass-shard"
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: s.dx, y: s.dy, rotate: s.rot, opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              clipPath: SHARD_CLIPS[s.clip],
              borderRadius: 2,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default CertShatter;
