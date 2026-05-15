"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { GlassEffect } from "./glass";

interface HeroCircleProps {
  imageBwSrc?: string;
  imageColorSrc?: string;
  name?: string;
  tagline?: string;
  location?: string;
}

const ABOUT_LEFT = {
  label: "01 / OPERACIONES",
  headline: "Ocho años traduciendo métricas en decisiones.",
  small: "Lyft. inDrive. Kavak. México y LATAM.",
};

const ABOUT_RIGHT = {
  label: "02 / HUMANIDAD",
  headline: "Soy humano y nada humano me es ajeno.",
  small: "INTP. Zurdo. Alérgico a lo genérico.",
};

export const HeroCircle: React.FC<HeroCircleProps> = ({
  imageBwSrc = "/juan-bn.png",
  imageColorSrc = "/juan-color.png",
  name = "Juan Fernández",
  tagline = "Operations Lead. Mobility · CX · Growth.",
  location = "Tlalnepantla, MX",
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [bwError, setBwError] = React.useState(false);
  const [colorError, setColorError] = React.useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 22]);
  const bwOpacity = useTransform(scrollYProgress, [0, 0.35, 0.5], [1, 0, 0]);
  const colorOpacity = useTransform(scrollYProgress, [0, 0.15, 0.5], [0, 1, 1]);
  // Nombre/tagline desaparecen antes de que el círculo cubra el viewport
  // para evitar el momento de "negro sobre azul".
  const contentOpacity = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0]);

  // About-me aparece temprano, mientras el círculo todavía se abre.
  const aboutOpacity = useTransform(scrollYProgress, [0.04, 0.14], [0, 1]);
  const aboutY = useTransform(scrollYProgress, [0.04, 0.14], [24, 0]);

  const hasImages = !bwError || !colorError;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: "260vh" }}
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {/* Nav glass arriba */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute top-5 left-5 right-20 md:left-10 md:right-24 z-40"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <GlassEffect className="rounded-full px-5 md:px-6 py-3 items-center">
            <div className="flex w-full items-center justify-between gap-4 text-zinc-900 dark:text-zinc-100">
              <span className="text-[11px] md:text-sm font-semibold tracking-[0.25em] uppercase truncate">
                {name}
              </span>
              <nav className="flex items-center gap-3 md:gap-6 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]">
                <a
                  href="#proyectos"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  Proyectos
                </a>
                <a
                  href="#blog"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  Blog
                </a>
                <a
                  href="#contacto"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  Contacto
                </a>
              </nav>
            </div>
          </GlassEffect>
        </motion.div>

        {/* About-me lateral izquierdo — operaciones */}
        <motion.aside
          style={{ opacity: aboutOpacity, y: aboutY }}
          className="absolute left-5 md:left-12 lg:left-20 top-1/2 -translate-y-1/2 z-30
                     max-w-[44%] sm:max-w-xs md:max-w-sm lg:max-w-md text-white"
        >
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/60 mb-4 md:mb-6">
            {ABOUT_LEFT.label}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-normal italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {ABOUT_LEFT.headline}
          </h2>
          <p className="mt-4 md:mt-6 text-xs md:text-sm font-mono text-white/70 leading-relaxed">
            {ABOUT_LEFT.small}
          </p>
        </motion.aside>

        {/* About-me lateral derecho — humanidad */}
        <motion.aside
          style={{ opacity: aboutOpacity, y: aboutY }}
          className="absolute right-5 md:right-12 lg:right-20 top-1/2 -translate-y-1/2 z-30
                     max-w-[44%] sm:max-w-xs md:max-w-sm lg:max-w-md text-white text-right"
        >
          <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/60 mb-4 md:mb-6">
            {ABOUT_RIGHT.label}
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-normal italic"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {ABOUT_RIGHT.headline}
          </h2>
          <p className="mt-4 md:mt-6 text-xs md:text-sm font-mono text-white/70 leading-relaxed">
            {ABOUT_RIGHT.small}
          </p>
        </motion.aside>

        {/* Layout centrado vertical: imagen+círculo arriba, nombre+tagline debajo */}
        <div className="relative h-full w-full flex flex-col items-center justify-center gap-8 px-6">
          <div className="relative flex items-end justify-center" style={{ height: "60vh" }}>
            <motion.div
              style={{ scale: circleScale }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0
                         h-[380px] w-[380px] md:h-[510px] md:w-[510px] lg:h-[620px] lg:w-[620px]
                         rounded-full"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="h-full w-full rounded-full transition-colors duration-500"
                style={{ background: "var(--circle, #1f5fa4)" }}
              />
            </motion.div>

            <div className="relative z-10 h-[60vh] w-[240px] md:w-[300px] lg:w-[360px] flex items-end justify-center">
              {!bwError && (
                <motion.img
                  src={imageBwSrc}
                  alt={name}
                  onError={() => setBwError(true)}
                  style={{
                    opacity: bwOpacity,
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 78%, transparent 96%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 78%, transparent 96%)",
                  }}
                  className="absolute bottom-0 h-[60vh] w-auto object-contain pointer-events-none select-none"
                />
              )}
              {!colorError && (
                <motion.img
                  src={imageColorSrc}
                  alt={name}
                  onError={() => setColorError(true)}
                  style={{
                    opacity: colorOpacity,
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 78%, transparent 96%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 78%, transparent 96%)",
                  }}
                  className="absolute bottom-0 h-[60vh] w-auto object-contain pointer-events-none select-none"
                />
              )}
              {!hasImages && (
                <div className="absolute bottom-0 h-[40vh] w-full flex items-center justify-center text-center text-white/85 text-xs uppercase tracking-widest">
                  Subir foto a<br />
                  <code className="font-mono normal-case mt-2 opacity-90">
                    /public/juan-color.png
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Nombre + tagline debajo */}
          <motion.div
            style={{ opacity: contentOpacity }}
            className="relative z-20 flex flex-col items-center gap-3 text-center"
          >
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-none tracking-tight"
              style={{ color: "var(--fg)" }}
            >
              Juan Fernández.
            </h1>
            <p
              className="text-sm md:text-base uppercase tracking-[0.25em]"
              style={{ color: "var(--muted)" }}
            >
              {tagline}
            </p>
          </motion.div>
        </div>

        {/* Footer glass */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute bottom-5 left-5 right-5 md:left-10 md:right-10 z-40"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <GlassEffect className="rounded-full px-6 py-3">
            <div className="flex w-full items-center justify-between text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-[0.25em]">
              <span>{location}</span>
              <span className="opacity-70">scroll ↓</span>
            </div>
          </GlassEffect>
        </motion.div>
      </div>
    </div>
  );
};
