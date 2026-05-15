"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const LetterCard: React.FC = () => {
  return (
    <section
      id="carta-link"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/carta"
            className="group block relative rounded-3xl border overflow-hidden
                       transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0 opacity-50 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 80% at 80% 20%, rgba(255, 0, 191, 0.12) 0%, transparent 70%), radial-gradient(50% 60% at 10% 90%, rgba(31, 95, 164, 0.10) 0%, transparent 70%)",
              }}
            />

            <div className="relative p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
              <div className="flex-1">
                <p
                  className="text-[10px] md:text-xs font-mono uppercase tracking-[0.4em] mb-4"
                  style={{ color: "var(--muted)" }}
                >
                  Una carta · Abril 2026
                </p>
                <h3
                  className="text-3xl md:text-5xl leading-[1.05] tracking-tight italic font-normal mb-4"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Cerré un capítulo.
                  <br />
                  <span style={{ opacity: 0.55 }}>
                    Para quienes compartieron camino.
                  </span>
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed max-w-md"
                  style={{ color: "var(--fg)", opacity: 0.75 }}
                >
                  Una despedida pública para amigos y colegas. Inglés y español,
                  sin filtros.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="text-xs md:text-sm font-mono uppercase tracking-[0.25em]"
                  style={{ color: "var(--circle)" }}
                >
                  Leerla
                </span>
                <ArrowUpRight
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  style={{ color: "var(--circle)" }}
                />
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default LetterCard;
