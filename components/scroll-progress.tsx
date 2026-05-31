"use client";

import React from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

type SectionDef = { id: string; label: string };

// Anclado a los id reales que ya existen en page.tsx y los componentes de sección.
const SECTIONS: SectionDef[] = [
  { id: "hero", label: "Inicio" },
  { id: "manifesto", label: "Manifiesto" },
  { id: "trayectoria", label: "Trayectoria" },
  { id: "carta-link", label: "Carta" },
  { id: "certificaciones", label: "Certificaciones" },
  { id: "proyectos", label: "Proyectos" },
  { id: "blog", label: "Blog" },
  { id: "contacto", label: "Contacto" },
];

const RAIL_HEIGHT = 280; // alto compacto del riel (px) — indicador, no barra full-height

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

export const ScrollProgress: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const railRef = React.useRef<HTMLDivElement | null>(null);
  const cardTimer = React.useRef<number | undefined>(undefined);

  const [hovered, setHovered] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [cardVisible, setCardVisible] = React.useState(false);

  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  });
  const progress = reduceMotion ? scrollYProgress : smooth;

  const handleY = useTransform(progress, [0, 1], [0, RAIL_HEIGHT]);

  const expanded = hovered || dragging;

  // Card flotante: aparece al cambiar de sección, se oculta sola.
  const flashCard = React.useCallback(() => {
    setCardVisible(true);
    if (cardTimer.current) window.clearTimeout(cardTimer.current);
    cardTimer.current = window.setTimeout(() => setCardVisible(false), 2200);
  }, []);

  // Detecta la sección activa con IntersectionObserver (preciso para la card).
  React.useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];
    if (!els.length) return;

    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        }
        let bestId = SECTIONS[0].id;
        let best = -1;
        ratios.forEach((ratio, id) => {
          if (ratio > best) {
            best = ratio;
            bestId = id;
          }
        });
        const idx = SECTIONS.findIndex((s) => s.id === bestId);
        if (idx >= 0) {
          setActiveIndex((prev) => {
            if (prev !== idx) flashCard();
            return idx;
          });
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-15% 0px -15% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [flashCard]);

  React.useEffect(() => {
    return () => {
      if (cardTimer.current) window.clearTimeout(cardTimer.current);
    };
  }, []);

  const scrollToFraction = (f: number, smoothScroll = false) => {
    const max =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: clamp(f) * max,
      behavior: smoothScroll && !reduceMotion ? "smooth" : "auto",
    });
  };

  const pointerToFraction = (clientY: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const rect = rail.getBoundingClientRect();
    scrollToFraction((clientY - rect.top) / rect.height);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
    pointerToFraction(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    pointerToFraction(e.clientY);
  };

  const endDrag = (e: React.PointerEvent) => {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  const goToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <>
      {/* Barra de progreso superior — solo móvil (<md). Sutil, no interactiva. */}
      <motion.div
        aria-hidden
        className="fixed left-0 top-0 z-40 h-[3px] w-full origin-left md:hidden"
        style={{
          scaleX: progress,
          background:
            "linear-gradient(90deg, var(--circle), var(--blue-400))",
        }}
      />

      {/* Riel vertical — desktop/tablet (md+). */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 select-none md:flex md:items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Etiquetas — aparecen al hacer hover, a la izquierda del riel. */}
        <div className="mr-3 flex flex-col justify-between py-0">
          <AnimatePresence>
            {expanded && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col justify-between text-right"
                style={{ height: RAIL_HEIGHT }}
              >
                {SECTIONS.map((s, i) => (
                  <li key={s.id} className="-my-1 leading-none">
                    <button
                      onClick={() => goToSection(s.id)}
                      className="text-[11px] tracking-wide transition-colors"
                      style={{
                        color:
                          i === activeIndex ? "var(--fg)" : "var(--muted)",
                        fontWeight: i === activeIndex ? 600 : 400,
                      }}
                    >
                      {s.label}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Riel interactivo. */}
        <div
          ref={railRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="relative cursor-pointer touch-none"
          style={{ height: RAIL_HEIGHT, width: 22 }}
        >
          {/* Track de fondo. */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full transition-all duration-300"
            style={{
              height: "100%",
              width: expanded ? 6 : 2,
              background: "var(--border)",
            }}
          />
          {/* Relleno de progreso. */}
          <motion.div
            className="absolute left-1/2 top-0 -translate-x-1/2 origin-top rounded-full transition-[width] duration-300"
            style={{
              height: "100%",
              width: expanded ? 6 : 2,
              scaleY: progress,
              background:
                "linear-gradient(180deg, var(--circle), var(--blue-400))",
            }}
          />

          {/* Marcadores de sección. */}
          {SECTIONS.map((s, i) => {
            const top = (i / (SECTIONS.length - 1)) * RAIL_HEIGHT;
            const isActive = i === activeIndex;
            return (
              <button
                key={s.id}
                aria-label={`Ir a ${s.label}`}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSection(s.id);
                }}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300"
                style={{
                  top,
                  width: isActive ? 9 : expanded ? 7 : 5,
                  height: isActive ? 9 : expanded ? 7 : 5,
                  background: isActive ? "var(--circle)" : "var(--bg)",
                  border: `1.5px solid ${
                    isActive ? "var(--circle)" : "var(--muted)"
                  }`,
                  boxShadow: isActive
                    ? "0 0 10px 1px color-mix(in srgb, var(--circle) 60%, transparent)"
                    : "none",
                }}
              />
            );
          })}

          {/* Handle arrastrable. */}
          <motion.div
            style={{ y: handleY }}
            className="pointer-events-none absolute left-1/2 top-0 -mt-2 -translate-x-1/2"
          >
            <div
              className="rounded-full transition-all duration-300"
              style={{
                width: expanded ? 16 : 12,
                height: expanded ? 16 : 12,
                background: "var(--circle)",
                border: "2px solid var(--bg)",
                boxShadow:
                  "0 2px 8px rgba(0,0,0,0.25), 0 0 0 1px color-mix(in srgb, var(--circle) 40%, transparent)",
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Card flotante — aparece al entrar a una sección. Estilo glass sobrio. */}
      <AnimatePresence>
        {cardVisible && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 16, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 16, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card fixed right-12 top-1/2 z-40 hidden -translate-y-1/2 rounded-2xl px-4 py-3 md:block"
          >
            <p
              className="text-[10px] uppercase tracking-[0.2em]"
              style={{ color: "var(--muted)" }}
            >
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(SECTIONS.length).padStart(2, "0")}
            </p>
            <p
              className="mt-0.5 text-sm font-medium"
              style={{ color: "var(--fg)" }}
            >
              {SECTIONS[activeIndex].label}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
