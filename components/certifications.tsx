"use client";

import React from "react";
import { motion } from "framer-motion";

import { CertShatter, type CertItem } from "@/components/cert-shatter";

const CERTIFICATIONS: CertItem[] = [
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

        <CertShatter items={CERTIFICATIONS} />
      </div>
    </section>
  );
};

export default Certifications;
