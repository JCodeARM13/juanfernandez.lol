"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
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

const SHATTER_SPEED = 6; // umbral de velocidad de impacto
const LONG_PRESS_MS = 600;
const FRAG_LIFETIME = 1900;

// ── Geometría ────────────────────────────────────────────────────
type Pt = { x: number; y: number };

function lerpX(a: Pt, b: Pt, x: number): Pt {
  const t = (x - a.x) / (b.x - a.x);
  return { x, y: a.y + t * (b.y - a.y) };
}
function lerpY(a: Pt, b: Pt, y: number): Pt {
  const t = (y - a.y) / (b.y - a.y);
  return { x: a.x + t * (b.x - a.x), y };
}
// Recorta un polígono al rectángulo [0,w]x[0,h] (Sutherland-Hodgman).
function clipToRect(poly: Pt[], w: number, h: number): Pt[] {
  const edges: { inside: (p: Pt) => boolean; cut: (a: Pt, b: Pt) => Pt }[] = [
    { inside: (p) => p.x >= 0, cut: (a, b) => lerpX(a, b, 0) },
    { inside: (p) => p.x <= w, cut: (a, b) => lerpX(a, b, w) },
    { inside: (p) => p.y >= 0, cut: (a, b) => lerpY(a, b, 0) },
    { inside: (p) => p.y <= h, cut: (a, b) => lerpY(a, b, h) },
  ];
  let out = poly;
  for (const e of edges) {
    const input = out;
    out = [];
    for (let i = 0; i < input.length; i++) {
      const cur = input[i];
      const prev = input[(i + input.length - 1) % input.length];
      const curIn = e.inside(cur);
      const prevIn = e.inside(prev);
      if (curIn) {
        if (!prevIn) out.push(e.cut(prev, cur));
        out.push(cur);
      } else if (prevIn) {
        out.push(e.cut(prev, cur));
      }
    }
    if (out.length === 0) return [];
  }
  return out;
}
function centroid(poly: Pt[]): Pt {
  let x = 0;
  let y = 0;
  for (const p of poly) {
    x += p.x;
    y += p.y;
  }
  return { x: x / poly.length, y: y / poly.length };
}
function area(poly: Pt[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a) / 2;
}

// Patrón de impacto: rayos radiales + anillos concéntricos desde (ix,iy).
function shatterPattern(w: number, h: number, ix: number, iy: number) {
  const RAYS = 9 + Math.floor(Math.random() * 3); // 9-11
  const ringCount = 2 + Math.floor(Math.random() * 2); // 2-3
  const maxR =
    Math.hypot(Math.max(ix, w - ix), Math.max(iy, h - iy)) * 1.15;

  const rings: number[] = [0];
  for (let j = 1; j <= ringCount; j++) {
    rings.push((maxR * j) / ringCount * (0.72 + Math.random() * 0.45));
  }

  const step = (Math.PI * 2) / RAYS;
  const angles: number[] = [];
  for (let i = 0; i < RAYS; i++) {
    angles.push(i * step + (Math.random() - 0.5) * step * 0.55);
  }
  angles.push(angles[0] + Math.PI * 2);

  const polar = (a: number, r: number): Pt => ({
    x: ix + Math.cos(a) * r,
    y: iy + Math.sin(a) * r,
  });

  const polys: Pt[][] = [];
  for (let i = 0; i < RAYS; i++) {
    const a0 = angles[i];
    const a1 = angles[i + 1];
    for (let j = 0; j < rings.length - 1; j++) {
      const r0 = rings[j];
      const r1 = rings[j + 1];
      const raw =
        r0 === 0
          ? [{ x: ix, y: iy }, polar(a0, r1), polar(a1, r1)]
          : [polar(a0, r0), polar(a1, r0), polar(a1, r1), polar(a0, r1)];
      const clipped = clipToRect(raw, w, h);
      if (clipped.length >= 3 && area(clipped) > 40) polys.push(clipped);
    }
  }
  return { polys, angles: angles.slice(0, RAYS), rings: rings.slice(1), maxR };
}

function rotate(x: number, y: number, t: number): Pt {
  const c = Math.cos(t);
  const s = Math.sin(t);
  return { x: x * c - y * s, y: x * s + y * c };
}

// ── Tipos de render ──────────────────────────────────────────────
type Geom = { left: number; top: number; width: number; height: number; cx: number; cy: number };
type Fragment = {
  id: number;
  w: number;
  h: number;
  ox: number; // origen de transformación (centroide local)
  oy: number;
  clip: string;
  initial: string;
};
type Crack = {
  id: number;
  w: number;
  h: number;
  ix: number;
  iy: number;
  angles: number[];
  rings: number[];
  maxR: number;
  transform: string;
};

let seq = 0;

export function CertShatter({ items }: { items: CertItem[] }) {
  const [mode, setMode] = useState<"idle" | "destroy">("idle");
  const [containerH, setContainerH] = useState<number | null>(null);
  const [broken, setBroken] = useState<Set<number>>(() => new Set());
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [cracks, setCracks] = useState<Crack[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const geomRef = useRef<Geom[]>([]);

  // long-press
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStart = useRef<Pt | null>(null);
  const longPressFired = useRef(false);

  // física
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fragBodies = useRef<Map<number, { body: any; ox: number; oy: number; theta: number }>>(
    new Map(),
  );
  const fragEls = useRef<Map<number, HTMLDivElement>>(new Map());
  const worldApi = useRef<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Composite: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    world: any;
  } | null>(null);

  const audioRef = useRef<AudioContext | null>(null);
  const playShatter = useCallback(() => {
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ac = audioRef.current ?? (audioRef.current = new Ctx());
      const dur = 0.24;
      const buffer = ac.createBuffer(1, Math.floor(ac.sampleRate * dur), ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2.6);
      }
      const src = ac.createBufferSource();
      src.buffer = buffer;
      const hp = ac.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 2700;
      const gain = ac.createGain();
      gain.gain.value = 0.2;
      src.connect(hp);
      hp.connect(gain);
      gain.connect(ac.destination);
      src.start();
    } catch {
      /* best-effort */
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
      geom[i] = { left, top, width: r.width, height: r.height, cx: left + r.width / 2, cy: top + r.height / 2 };
    });
    geomRef.current = geom;
    setContainerH(crect.height);
    setBroken(new Set());
    setFragments([]);
    setCracks([]);
    setMode("destroy");
  }, [mode]);

  const repair = useCallback(() => {
    cardRefs.current.forEach((el) => {
      if (el) el.style.transform = "";
    });
    fragBodies.current.clear();
    fragEls.current.clear();
    setFragments([]);
    setCracks([]);
    setBroken(new Set());
    setContainerH(null);
    setMode("idle");
  }, []);

  // ── Long-press para activar (un click normal abre el PDF al instante) ──
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (mode === "destroy") return;
      longPressFired.current = false;
      pressStart.current = { x: e.clientX, y: e.clientY };
      if (pressTimer.current) clearTimeout(pressTimer.current);
      pressTimer.current = setTimeout(() => {
        pressTimer.current = null;
        longPressFired.current = true;
        enterDestroy();
      }, LONG_PRESS_MS);
    },
    [mode, enterDestroy],
  );
  const cancelPress = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pressStart.current || !pressTimer.current) return;
    const dx = e.clientX - pressStart.current.x;
    const dy = e.clientY - pressStart.current.y;
    if (dx * dx + dy * dy > 100) cancelPress(); // se movió >10px → es scroll/arrastre
  }, [cancelPress]);
  const onCardClick = useCallback((e: React.MouseEvent) => {
    if (mode === "destroy" || longPressFired.current) {
      e.preventDefault(); // tras long-press o en destrucción, el click no navega
      longPressFired.current = false;
    }
    // en idle, click normal => deja que el <a href> abra el PDF al instante
  }, [mode]);

  // Cierre de recursos al desmontar.
  useEffect(() => {
    return () => {
      if (pressTimer.current) clearTimeout(pressTimer.current);
      if (audioRef.current) {
        audioRef.current.close().catch(() => {});
        audioRef.current = null;
      }
    };
  }, []);

  // Salir del modo destrucción si cambia tamaño/orientación: la geometría y
  // las paredes se miden una sola vez al activar; en resize quedan desfasadas.
  useEffect(() => {
    if (mode !== "destroy") return;
    const onResize = () => repair();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [mode, repair]);

  // ── Mundo de física ──────────────────────────────────────────────
  useEffect(() => {
    if (mode !== "destroy") return;
    let cancelled = false;
    const cleanups: (() => void)[] = [];
    const removeTimers: ReturnType<typeof setTimeout>[] = [];

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
      const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = Matter;

      const engine = Engine.create();
      engine.enableSleeping = true; // los cuerpos en reposo dejan de integrarse
      engine.gravity.y = 1.1;
      worldApi.current = { Composite, world: engine.world };

      const t = 260;
      const wallOpts = { isStatic: true, label: "wall", restitution: 0.35 };
      const walls = [
        Bodies.rectangle(W / 2, H + t / 2, W + t * 2, t, wallOpts),
        Bodies.rectangle(W / 2, -t / 2, W + t * 2, t, wallOpts),
        Bodies.rectangle(-t / 2, H / 2, t, H + t * 2, wallOpts),
        Bodies.rectangle(W + t / 2, H / 2, t, H + t * 2, wallOpts),
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cardBodies: any[] = [];
      geom.forEach((g, i) => {
        if (!g.width) {
          cardBodies[i] = null;
          return;
        }
        cardBodies[i] = Bodies.rectangle(g.cx, g.cy, g.width, g.height, {
          restitution: 0.4,
          friction: 0.35,
          frictionAir: 0.012,
          chamfer: { radius: 10 },
          label: `cert-${i}`,
        });
      });

      const mouse = Mouse.create(container);
      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      Composite.add(engine.world, [...walls, ...cardBodies.filter(Boolean), mc]);

      const runner = Runner.create();
      Runner.run(runner, engine);

      const onAfter = () => {
        for (let i = 0; i < cardBodies.length; i++) {
          const body = cardBodies[i];
          const el = cardRefs.current[i];
          const g = geom[i];
          if (!body || !el || !g) continue;
          if (body.isSleeping) continue; // ya asentado: no reescribir transform
          el.style.transform = `translate(${body.position.x - g.cx}px, ${body.position.y - g.cy}px) rotate(${body.angle}rad)`;
        }
        fragBodies.current.forEach((fb, id) => {
          const el = fragEls.current.get(id);
          if (!el || fb.body.isSleeping) return;
          el.style.transform = `translate(${fb.body.position.x - fb.ox}px, ${fb.body.position.y - fb.oy}px) rotate(${fb.theta + fb.body.angle}rad)`;
        });
      };
      Events.on(engine, "afterUpdate", onAfter);

      let armed = false;
      const armTimer = setTimeout(() => {
        armed = true;
      }, 750);

      const localBroken = new Set<number>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doShatter = (i: number, body: any, impact: Pt | null) => {
        if (i < 0 || Number.isNaN(i) || localBroken.has(i)) return;
        localBroken.add(i);

        const g = geom[i];
        const pos = { x: body.position.x, y: body.position.y };
        const theta = body.angle;
        const vel = { x: body.velocity.x, y: body.velocity.y };
        Composite.remove(engine.world, body);
        cardBodies[i] = null;
        if (!g) return;

        const w = g.width;
        const h = g.height;
        // impacto en coords locales (sin rotar) del cert
        let ix = w / 2;
        let iy = h / 2;
        if (impact) {
          const rel = rotate(impact.x - pos.x, impact.y - pos.y, -theta);
          ix = Math.min(w - 2, Math.max(2, rel.x + w / 2));
          iy = Math.min(h - 2, Math.max(2, rel.y + h / 2));
        }

        const { polys, angles, rings, maxR } = shatterPattern(w, h, ix, iy);
        const newFrags: Fragment[] = [];

        for (const poly of polys) {
          if (fragBodies.current.size >= 110) break; // cap de rendimiento
          const cl = centroid(poly);
          // vértices centrados y rotados a la orientación del cert al romperse
          const verts = poly.map((p) => {
            const r = rotate(p.x - cl.x, p.y - cl.y, theta);
            return { x: r.x, y: r.y };
          });
          // centro mundial de la esquirla
          const rc = rotate(cl.x - w / 2, cl.y - h / 2, theta);
          const wc = { x: pos.x + rc.x, y: pos.y + rc.y };
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let fragBody: any = null;
          try {
            fragBody = Bodies.fromVertices(wc.x, wc.y, [verts], {
              restitution: 0.3,
              friction: 0.4,
              frictionAir: 0.01,
              label: "shard",
            });
          } catch {
            fragBody = null;
          }
          if (!fragBody) continue;

          const dir = Math.hypot(rc.x, rc.y) || 1;
          const spread = 5 + Math.random() * 4;
          Body.setVelocity(fragBody, {
            x: vel.x * 0.5 + (rc.x / dir) * spread + (Math.random() - 0.5) * 2,
            y: vel.y * 0.5 + (rc.y / dir) * spread - 1.5,
          });
          Body.setAngularVelocity(fragBody, (Math.random() - 0.5) * 0.5);
          Composite.add(engine.world, fragBody);

          const id = seq++;
          fragBodies.current.set(id, { body: fragBody, ox: cl.x, oy: cl.y, theta });
          const clip =
            "polygon(" +
            poly.map((p) => `${((p.x / w) * 100).toFixed(2)}% ${((p.y / h) * 100).toFixed(2)}%`).join(", ") +
            ")";
          const initial = `translate(${wc.x - cl.x}px, ${wc.y - cl.y}px) rotate(${theta}rad)`;
          newFrags.push({ id, w, h, ox: cl.x, oy: cl.y, clip, initial });
        }

        const crackId = seq++;
        const crack: Crack = {
          id: crackId,
          w,
          h,
          ix,
          iy,
          angles,
          rings,
          maxR,
          transform: `translate(${pos.x - w / 2}px, ${pos.y - h / 2}px) rotate(${theta}rad)`,
        };

        setFragments((prev) => [...prev, ...newFrags]);
        setCracks((prev) => [...prev, crack]);
        setBroken((prev) => {
          const n = new Set(prev);
          n.add(i);
          return n;
        });
        playShatter();

        const crackTimer = setTimeout(
          () => setCracks((prev) => prev.filter((c) => c.id !== crackId)),
          450,
        );
        const ids = newFrags.map((f) => f.id);
        const fragTimer = setTimeout(() => {
          ids.forEach((id) => {
            const fb = fragBodies.current.get(id);
            if (fb) {
              try {
                Composite.remove(engine.world, fb.body);
              } catch {
                /* noop */
              }
              fragBodies.current.delete(id);
            }
            fragEls.current.delete(id);
          });
          setFragments((prev) => prev.filter((f) => !ids.includes(f.id)));
        }, FRAG_LIFETIME);
        removeTimers.push(crackTimer, fragTimer);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const onCollide = (evt: any) => {
        if (!armed) return;
        for (const pair of evt.pairs) {
          const a = pair.bodyA;
          const b = pair.bodyB;
          const aCert = typeof a.label === "string" && a.label.startsWith("cert-");
          const bCert = typeof b.label === "string" && b.label.startsWith("cert-");
          if (!aCert || !bCert) continue;
          if (Math.max(a.speed, b.speed) < SHATTER_SPEED) continue;
          const support =
            pair.collision && pair.collision.supports && pair.collision.supports[0]
              ? { x: pair.collision.supports[0].x, y: pair.collision.supports[0].y }
              : null;
          doShatter(parseInt(a.label.slice(5), 10), a, support);
          doShatter(parseInt(b.label.slice(5), 10), b, support);
        }
      };
      Events.on(engine, "collisionStart", onCollide);

      cleanups.push(() => {
        clearTimeout(armTimer);
        removeTimers.forEach((tm) => clearTimeout(tm));
        Events.off(engine, "afterUpdate", onAfter);
        Events.off(engine, "collisionStart", onCollide);
        Runner.stop(runner);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        if (typeof Mouse.clearSourceEvents === "function") Mouse.clearSourceEvents(mouse);
        worldApi.current = null;
        fragBodies.current.clear();
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
                        transition: "opacity 0.1s ease",
                      }
                    : undefined
                }
              >
                <a
                  href={cert.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={cancelPress}
                  onPointerLeave={cancelPress}
                  onPointerCancel={cancelPress}
                  onClick={onCardClick}
                  onContextMenu={(e) => {
                    if (mode === "destroy") e.preventDefault();
                  }}
                  draggable={false}
                  className="cert-card group relative flex h-full flex-col rounded-2xl p-5 md:p-6 select-none transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    cursor: mode === "destroy" ? "grab" : "pointer",
                    WebkitTouchCallout: "none",
                  }}
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
                        <span className="text-xs font-semibold tracking-wide">{cert.issuer}</span>
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

        {cracks.map((c) => (
          <svg
            key={c.id}
            className="cert-crack"
            width={c.w}
            height={c.h}
            viewBox={`0 0 ${c.w} ${c.h}`}
            style={{ width: c.w, height: c.h, transform: c.transform, transformOrigin: `${c.w / 2}px ${c.h / 2}px` }}
          >
            {c.angles.map((a, idx) => (
              <line
                key={`l${idx}`}
                x1={c.ix}
                y1={c.iy}
                x2={c.ix + Math.cos(a) * c.maxR}
                y2={c.iy + Math.sin(a) * c.maxR}
                strokeWidth={1}
              />
            ))}
            {c.rings.map((r, idx) => (
              <circle key={`r${idx}`} cx={c.ix} cy={c.iy} r={r} strokeWidth={1} strokeDasharray="6 5" />
            ))}
          </svg>
        ))}

        {fragments.map((f) => (
          <div
            key={f.id}
            ref={(el) => {
              if (el) fragEls.current.set(f.id, el);
              else fragEls.current.delete(f.id);
            }}
            className="glass-shard"
            style={{
              width: f.w,
              height: f.h,
              clipPath: f.clip,
              transformOrigin: `${f.ox}px ${f.oy}px`,
              transform: f.initial,
            }}
          />
        ))}
      </div>
    </>
  );
}

export default CertShatter;
