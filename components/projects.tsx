"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { GradientCard } from "@/components/gradient-card";

type Project = {
  number: string;
  title: string;
  domain: string;
  blurb: string;
  status: string;
  href?: string;
};

const PROJECTS: Project[] = [
  {
    number: "01",
    title: "Mobility Ops",
    domain: "Lyft · inDrive · Kavak",
    blurb:
      "Ocho años en el suelo: pricing, supply, CX y scale en LATAM.",
    status: "En curso",
  },
  {
    number: "02",
    title: "Nightride",
    domain: "Producto propio",
    blurb:
      "Experimento sobre movilidad nocturna, seguridad y comunidad.",
    status: "Próximamente",
  },
  {
    number: "03",
    title: "AXION",
    domain: "Producto propio",
    blurb:
      "Plataforma operativa para flotillas y conductores independientes.",
    status: "Próximamente",
  },
  {
    number: "04",
    title: "M2M Relay",
    domain: "Infraestructura AI",
    blurb:
      "Canal cifrado para comunicación entre IAs sobre internet.",
    status: "Live",
    href: "https://m2m.juanfernandez.lol",
  },
  {
    number: "05",
    title: "SSV",
    domain: "Herramienta personal",
    blurb:
      "Lector RSVP con velocidad increscendo. Pega texto y lee más rápido.",
    status: "Live",
    href: "https://ssv.jcfvg.com",
  },
];

export const Projects: React.FC = () => {
  return (
    <section
      id="proyectos"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      {/* Aurora glow de fondo, sutil — refuerza el liquid glass */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-50"
        style={{
          background:
            "radial-gradient(60% 50% at 20% 30%, color-mix(in oklab, var(--circle) 35%, transparent) 0%, transparent 70%), radial-gradient(50% 40% at 80% 70%, color-mix(in oklab, var(--circle) 25%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-12 md:mb-16"
        >
          <span
            className="block w-2 h-2 rounded-full"
            style={{ background: "var(--circle, #1f5fa4)" }}
          />
          <p
            className="text-[10px] md:text-xs uppercase tracking-[0.4em]"
            style={{ color: "var(--muted)" }}
          >
            Proyectos
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <a
                href={p.href || "#"}
                target={p.href ? "_blank" : undefined}
                rel={p.href ? "noopener noreferrer" : undefined}
                onClick={p.href ? undefined : (e) => e.preventDefault()}
                className="block h-full"
              >
                <GradientCard className="glass-card flex h-full flex-col justify-between rounded-2xl p-6 md:p-8 min-h-[220px] md:min-h-[260px] cursor-default transition-transform duration-500 hover:-translate-y-1">
                  <div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10px] md:text-xs font-mono tracking-[0.25em]"
                        style={{ color: "var(--circle, #1f5fa4)" }}
                      >
                        {p.number}
                      </span>
                      <span
                        className="text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]"
                        style={{ color: "var(--muted)" }}
                      >
                        {p.status}
                      </span>
                    </div>
                    <h3 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
                      {p.title}
                    </h3>
                    <p
                      className="mt-2 text-xs md:text-sm font-mono uppercase tracking-[0.2em]"
                      style={{ color: "var(--muted)" }}
                    >
                      {p.domain}
                    </p>
                  </div>
                  <div className="mt-6 flex items-end justify-between gap-4">
                    <p
                      className="text-sm md:text-[15px] leading-relaxed max-w-xs"
                      style={{ color: "var(--fg)", opacity: 0.85 }}
                    >
                      {p.blurb}
                    </p>
                    <ArrowUpRight className="w-4 h-4 shrink-0 opacity-30 group-hover:opacity-70 transition-opacity" />
                  </div>
                </GradientCard>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
