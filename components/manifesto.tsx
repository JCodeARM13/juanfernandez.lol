"use client";

import React from "react";
import { motion } from "framer-motion";

const APHORISMS: { number: string; text: string; gloss: string }[] = [
  {
    number: "i",
    text: "Mapa primero, detalle después.",
    gloss: "La forma de la decisión importa más que la decisión misma.",
  },
  {
    number: "ii",
    text: "Las métricas son personas con disfraz de número.",
    gloss: "Detrás de cada KPI hay un usuario. Detrás de cada usuario, una vida.",
  },
  {
    number: "iii",
    text: "Pienso lento. Ejecuto rápido.",
    gloss: "La velocidad sin claridad es ruido. La claridad sin velocidad es deuda.",
  },
  {
    number: "iv",
    text: "Parcial hoy le gana a perfecto la próxima semana.",
    gloss: "Itera o muere. Lo terminado vence a lo ideal.",
  },
];

export const Manifesto: React.FC = () => {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ background: "#070b13", color: "#f5f5f5" }}
    >
      {/* Aurora glow sutil */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(31,95,164,0.18) 0%, transparent 60%), radial-gradient(40% 35% at 80% 100%, rgba(45,122,217,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-5xl mx-auto px-6 md:px-10 py-32 md:py-44">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-10 md:mb-14"
        >
          <span
            className="block w-2 h-2 rounded-full"
            style={{ background: "var(--brand-blue, #1f5fa4)" }}
          />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/60">
            Manifiesto
          </p>
        </motion.div>

        {/* Intro line */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight italic font-normal text-white max-w-3xl mb-20 md:mb-28"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Cuatro reglas que escribí para mí.
          <span className="block text-white/45 mt-1">
            Funcionan en mobility. Funcionan en la vida.
          </span>
        </motion.h2>

        {/* Aphorisms */}
        <ol className="space-y-16 md:space-y-24">
          {APHORISMS.map((item, i) => (
            <motion.li
              key={item.number}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.85,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid grid-cols-[auto_1fr] gap-x-6 md:gap-x-10 items-baseline"
            >
              {/* Numeral */}
              <span
                className="text-2xl md:text-4xl italic font-normal leading-none text-white/30 select-none"
                style={{ fontFamily: "'Instrument Serif', serif" }}
                aria-hidden
              >
                {item.number}.
              </span>

              {/* Aphorism + gloss */}
              <div className="flex flex-col gap-3 md:gap-4">
                <p
                  className="text-3xl md:text-5xl lg:text-[56px] leading-[1.05] tracking-tight italic font-normal text-white"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {item.text}
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/55 max-w-xl">
                  {item.gloss}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-24 md:mt-32 flex items-center gap-3"
        >
          <span
            className="block h-px w-10"
            style={{
              background:
                "linear-gradient(90deg, var(--brand-blue, #1f5fa4), transparent)",
            }}
          />
          <p className="text-[11px] md:text-xs font-mono uppercase tracking-[0.3em] text-white/45">
            Juan Fernández · Tlalnepantla
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Manifesto;
