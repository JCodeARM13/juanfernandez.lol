"use client";

import React from "react";
import { motion } from "framer-motion";

type Company = {
  name: string;
  logo: string;
  height: number;
  url: string;
};

const COMPANIES: Company[] = [
  { name: "Lyft", logo: "/companies/lyft.png", height: 56, url: "https://www.lyft.com" },
  { name: "inDrive", logo: "/companies/indrive.png", height: 32, url: "https://indrive.com" },
  { name: "Verizon", logo: "/companies/verizon.png", height: 28, url: "https://www.verizon.com" },
  { name: "Kavak", logo: "/companies/kavak.png", height: 30, url: "https://www.kavak.com" },
  { name: "HSBC", logo: "/companies/hsbc.png", height: 32, url: "https://www.hsbc.com" },
  { name: "Universidad CNCI", logo: "/companies/cnci.png", height: 56, url: "https://www.cnci.edu.mx" },
  { name: "Alcaldía Azcapotzalco", logo: "/companies/azcapotzalco.png", height: 44, url: "https://azcapotzalco.cdmx.gob.mx" },
];

const TRACK = [...COMPANIES, ...COMPANIES, ...COMPANIES];

export const Companies: React.FC = () => {
  return (
    <section
      id="trayectoria"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-24 md:pt-32 pb-12 md:pb-16">
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
            Trayectoria
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
          Lugares donde aprendí lo que sé.
        </motion.h2>
        <p
          className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] mb-14 md:mb-20"
          style={{ color: "var(--muted)" }}
        >
          Del más reciente al más viejo
        </p>
      </div>

      <div
        className="relative w-full overflow-hidden pb-24 md:pb-32"
        aria-label="Empresas e instituciones"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <motion.ul
          className="flex items-center gap-6 md:gap-8 w-max"
          animate={{ x: ["-33.333%", "0%"] }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {TRACK.map((c, i) => (
            <li key={`${c.name}-${i}`} className="shrink-0">
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                title={c.name}
                aria-label={`${c.name} — abrir sitio oficial`}
                className="logo-pill flex items-center justify-center
                           h-24 md:h-28 w-44 md:w-56
                           rounded-2xl bg-white border border-black/5
                           transition-all duration-300
                           hover:scale-[1.04] hover:shadow-lg hover:shadow-black/10"
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="w-auto object-contain select-none pointer-events-none"
                  style={{ height: `${c.height}px`, maxWidth: "80%" }}
                  draggable={false}
                  loading="lazy"
                />
              </a>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default Companies;
