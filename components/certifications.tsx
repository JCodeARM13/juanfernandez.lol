"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Certification = {
  issuer: "Anthropic" | "Platzi" | "Udemy" | "Domestika";
  issuerLogo: string;
  title: string;
  date: string; // YYYY-MM-DD
  file: string;
  hours?: string;
};

const CERTIFICATIONS: Certification[] = [
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "Introduction to subagents",
    date: "2026-05-19",
    file: "/certificates/anthropic-introduction-subagents.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "Claude Code 101",
    date: "2026-05-15",
    file: "/certificates/anthropic-claude-code-101.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "Introduction to Model Context Protocol",
    date: "2026-05-15",
    file: "/certificates/anthropic-introduction-mcp.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "AI Fluency for Small Businesses",
    date: "2026-05-15",
    file: "/certificates/anthropic-ai-fluency-small-businesses.pdf",
  },
  {
    issuer: "Domestika",
    issuerLogo: "/issuers/domestika.png",
    title: "Crea Cortometrajes con Inteligencia Artificial",
    date: "2026-05-05",
    file: "/certificates/domestika-cortometrajes-ia.pdf",
  },
  {
    issuer: "Domestika",
    issuerLogo: "/issuers/domestika.png",
    title: "Diseño de portadas de cómic: libera tu creatividad",
    date: "2026-04-30",
    file: "/certificates/domestika-diseno-portadas-comic.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "AI Fluency for educators",
    date: "2026-04-28",
    file: "/certificates/anthropic-ai-fluency-educators.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "AI Fluency: Framework & Foundations",
    date: "2026-04-13",
    file: "/certificates/anthropic-ai-fluency-framework-foundations.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "Teaching the AI Fluency Framework",
    date: "2026-04-13",
    file: "/certificates/anthropic-teaching-ai-fluency-framework.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "Introduction to Claude Cowork",
    date: "2026-04-13",
    file: "/certificates/anthropic-introduction-claude-cowork.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "AI Fluency for students",
    date: "2026-04-13",
    file: "/certificates/anthropic-ai-fluency-students.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "AI Fluency: AI Capabilities & Limitations",
    date: "2026-04-01",
    file: "/certificates/anthropic-ai-fluency-capabilities-limitations.pdf",
  },
  {
    issuer: "Udemy",
    issuerLogo: "/issuers/udemy.png",
    title: "ISO 37301 — Sistemas de gestión de compliance",
    date: "2026-03-19",
    hours: "4.5 h",
    file: "/certificates/udemy-iso-37301-compliance.jpg",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "Claude 101",
    date: "2026-03-15",
    file: "/certificates/anthropic-claude-101.pdf",
  },
  {
    issuer: "Anthropic",
    issuerLogo: "/issuers/anthropic.png",
    title: "Introduction to agent skills",
    date: "2026-03-11",
    file: "/certificates/anthropic-introduction-agent-skills.pdf",
  },
  {
    issuer: "Platzi",
    issuerLogo: "/issuers/platzi.png",
    title: "Curso de ChatGPT",
    date: "2025-04-13",
    hours: "15 h",
    file: "/certificates/platzi-chatgpt.pdf",
  },
  {
    issuer: "Platzi",
    issuerLogo: "/issuers/platzi.png",
    title: "Curso sobre la Historia del Dinero",
    date: "2025-04-13",
    hours: "9 h",
    file: "/certificates/platzi-historia-dinero.pdf",
  },
  {
    issuer: "Platzi",
    issuerLogo: "/issuers/platzi.png",
    title: "Introducción a la Inteligencia Artificial",
    date: "2025-04-12",
    hours: "4 h",
    file: "/certificates/platzi-introduccion-ia.pdf",
  },
];

const formatDate = (iso: string): string => {
  const [y, m] = iso.split("-");
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${months[parseInt(m, 10) - 1]} ${y}`;
};

export const Certifications: React.FC = () => {
  return (
    <section
      id="certificaciones"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-10 md:mb-14"
        >
          <span
            className="block w-2 h-2 rounded-full"
            style={{ background: "var(--circle, #1f5fa4)" }}
          />
          <p
            className="text-[10px] md:text-xs uppercase tracking-[0.4em]"
            style={{ color: "var(--muted)" }}
          >
            Certificaciones
          </p>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-2xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight italic font-normal max-w-3xl mb-2"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Lo que he estudiado, en papel.
        </motion.h2>
        <p
          className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] mb-14 md:mb-20"
          style={{ color: "var(--muted)" }}
        >
          {CERTIFICATIONS.length} certificados · cada uno descargable en PDF
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {CERTIFICATIONS.map((cert, i) => (
            <motion.li
              key={cert.file}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: Math.min(i, 8) * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <a
                href={cert.file}
                target="_blank"
                rel="noopener noreferrer"
                className="cert-card group relative flex flex-col h-full p-5 md:p-6 rounded-2xl
                           border transition-all duration-300
                           hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
                aria-label={`${cert.title} — ${cert.issuer} — abrir certificado`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-white border flex items-center justify-center"
                       style={{ borderColor: "var(--border)" }}>
                    <img
                      src={cert.issuerLogo}
                      alt={cert.issuer}
                      className="w-6 h-6 object-contain"
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
                  className="text-lg md:text-xl leading-snug font-normal italic mb-6"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  {cert.title}
                </h3>

                <div
                  className="mt-auto flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em]"
                  style={{ color: "var(--circle, #1f5fa4)" }}
                >
                  <span>Ver certificado</span>
                  <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Certifications;
