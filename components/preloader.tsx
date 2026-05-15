"use client";

import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Build log estilo terminal: el sitio se ensambla en tiempo real.
// Cada step tiene su propia imagen de fondo. La última (final) no tiene imagen.
type Step = {
  text: string;
  mode: "build" | "final";
  bg?: string;
};

const STEPS: Step[] = [
  { text: "iniciando",             mode: "build", bg: "/loader/loader-1.jpg" },
  { text: "cargando hero",         mode: "build", bg: "/loader/loader-2.jpg" },
  { text: "renderizando juan",     mode: "build", bg: "/loader/loader-3.jpg" },
  { text: "compilando manifiesto", mode: "build", bg: "/loader/loader-4.jpg" },
  { text: "inyectando humanidad",  mode: "build", bg: "/loader/loader-5.jpg" },
  { text: "ensamblando qr",        mode: "build", bg: "/loader/loader-6.jpg" },
  { text: "Hola.",                 mode: "final" },
];

// Lista única de imágenes para preload. Si alguna falla, el step muestra
// fondo negro sin error visible (fallback silencioso).
const BG_IMAGES = STEPS
  .map((s) => s.bg)
  .filter((s): s is string => Boolean(s));

const EASE = [0.76, 0, 0.24, 1] as const;

const slideUp: Variants = {
  initial: { top: 0 },
  exit: {
    top: "-100vh",
    transition: { duration: 0.85, ease: EASE, delay: 0.25 },
  },
};

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [index, setIndex] = React.useState(0);
  const [dimension, setDimension] = React.useState({ width: 0, height: 0 });
  const [isExiting, setIsExiting] = React.useState(false);
  const [imagesOk, setImagesOk] = React.useState<Record<string, boolean>>(
    () => Object.fromEntries(BG_IMAGES.map((src) => [src, true]))
  );

  React.useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Pre-carga las imágenes y marca cuáles fallaron, para fallback silencioso.
  React.useEffect(() => {
    BG_IMAGES.forEach((src) => {
      const img = new Image();
      img.onerror = () =>
        setImagesOk((prev) => ({ ...prev, [src]: false }));
      img.src = src;
    });
  }, []);

  React.useEffect(() => {
    const isLast = index === STEPS.length - 1;
    if (isLast) {
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        const completeTimer = setTimeout(() => onComplete?.(), 950);
        return () => clearTimeout(completeTimer);
      }, 1400);
      return () => clearTimeout(exitTimer);
    }
    // Build steps son rápidos para sentir actividad. Inicial un poco más largo.
    const delay = index === 0 ? 700 : 420;
    const tick = setTimeout(() => setIndex(index + 1), delay);
    return () => clearTimeout(tick);
  }, [index, onComplete]);

  const step = STEPS[index];
  const isFinal = step.mode === "final";

  // Imagen activa: la del step actual, sólo si cargó OK.
  const activeBg = step.bg && imagesOk[step.bg] ? step.bg : null;

  // Progreso lineal según el step actual.
  const progress = ((index + 1) / STEPS.length) * 100;

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const curve: Variants = {
    initial: { d: initialPath, transition: { duration: 0.7, ease: EASE } },
    exit: { d: targetPath, transition: { duration: 0.7, ease: EASE, delay: 0.3 } },
  };

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate={isExiting ? "exit" : "initial"}
      className="fixed inset-0 w-screen h-screen flex items-center justify-center z-[99999]"
      style={{ background: "#070b13" }}
    >
      {dimension.width > 0 && (
        <>
          {/* SVG curve al fondo (z-0). Su fill negro define la forma del slide-up. */}
          <svg
            className="absolute top-0 left-0 w-full h-[calc(100%+300px)] pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <motion.path
              variants={curve}
              initial="initial"
              animate={isExiting ? "exit" : "initial"}
              fill="#070b13"
            />
          </svg>

          {/* Backgrounds con cross-fade. Sólo el del step actual queda visible.
              En el step "final" no hay imagen activa (activeBg = null). */}
          {BG_IMAGES.map((src) => (
            imagesOk[src] && (
              <motion.div
                key={src}
                className="absolute inset-0 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: `url(${src})`, zIndex: 1 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: src === activeBg ? 0.85 : 0 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
              />
            )
          ))}

          {/* Overlay oscuro sutil para legibilidad sin matar la imagen.
              En el step final, oscurecemos casi por completo (sólo "Hola." se ve). */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 2 }}
            animate={{
              background: isFinal
                ? "radial-gradient(ellipse at center, rgba(7,11,19,1) 0%, rgba(7,11,19,1) 70%, rgba(7,11,19,1) 100%)"
                : "radial-gradient(ellipse at center, rgba(7,11,19,0.30) 0%, rgba(7,11,19,0.65) 70%, rgba(7,11,19,0.80) 100%)",
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* Texto principal: build log o saludo final */}
          <div className="absolute inset-0 flex items-center justify-center z-10 px-6">
            <AnimatePresence mode="wait">
              {isFinal ? (
                <motion.p
                  key="final"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="text-white text-6xl md:text-8xl lg:text-9xl font-normal italic tracking-tight text-center"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  Hola.
                </motion.p>
              ) : (
                <motion.div
                  key={`build-${index}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: EASE }}
                  className="flex items-center gap-3 text-zinc-100 text-xl md:text-2xl lg:text-3xl font-mono lowercase tracking-tight"
                  style={{ textShadow: "0 2px 24px rgba(0,0,0,0.6)" }}
                >
                  <span style={{ color: "var(--brand-blue, #1f5fa4)" }}>
                    →
                  </span>
                  {/* letra por letra para sensación de tipeo en tiempo real */}
                  <span className="inline-flex">
                    {step.text.split("").map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.025, duration: 0.15 }}
                      >
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                  </span>
                  {/* cursor parpadeante */}
                  <motion.span
                    aria-hidden
                    className="inline-block ml-1"
                    style={{ color: "var(--brand-blue, #1f5fa4)" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  >
                    ▊
                  </motion.span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Barra de carga: visible siempre, llega a 100% en "Hola." */}
          <div className="absolute bottom-14 md:bottom-20 left-1/2 -translate-x-1/2 z-10 w-[70%] max-w-sm">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-mono"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
              >
                build
              </p>
              <p
                className="text-[10px] tracking-[0.2em] text-zinc-400 font-mono tabular-nums"
                style={{ textShadow: "0 1px 12px rgba(0,0,0,0.6)" }}
              >
                {Math.round(progress).toString().padStart(2, "0")}%
              </p>
            </div>
            <div className="h-[2px] w-full bg-white/15 overflow-hidden rounded-full">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--brand-blue, #1f5fa4)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: EASE }}
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default Preloader;
