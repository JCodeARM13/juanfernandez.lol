"use client";

import React from "react";
import { motion } from "framer-motion";
import QRCodeStyling from "qr-code-styling";
import { HeroCircle } from "@/components/hero-circle";
import { Manifesto } from "@/components/manifesto";
import { Companies } from "@/components/companies";
import { LetterCard } from "@/components/letter-card";
import { Certifications } from "@/components/certifications";
import { Projects } from "@/components/projects";
import { Blog } from "@/components/blog";
import { Preloader } from "@/components/preloader";
import { Footer } from "@/components/footer";
import { GlassEffect, GlassFilter } from "@/components/glass";
import { ThemeToggle } from "@/components/theme-toggle";
import { DebugGrid } from "@/components/debug-grid";

const WHATSAPP_URL = "https://wa.me/525548869123";

const WhatsAppQR: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = ref.current;
    if (!container) return;
    container.replaceChildren();
    const qr = new QRCodeStyling({
      width: 220,
      height: 220,
      data: WHATSAPP_URL,
      type: "svg",
      backgroundOptions: { color: "transparent" },
      dotsOptions: { color: "#ffffff", type: "rounded" },
      cornersSquareOptions: { color: "#ffffff", type: "extra-rounded" },
      cornersDotOptions: { color: "#ffffff", type: "dot" },
    });
    qr.append(container);
  }, []);

  return (
    <div className="relative inline-block group">
      {/* Aurora glow rotando — invita a hacer clic.
          Conic-gradient con 5 colores que da la vuelta cada 10s.
          En hover crece y se vuelve más intenso. */}
      <motion.div
        aria-hidden
        className="absolute -inset-3 rounded-[2.25rem] opacity-70 blur-2xl pointer-events-none
                   group-hover:opacity-100 group-hover:-inset-4 transition-all duration-500"
        style={{
          background:
            "conic-gradient(from 0deg, #1f5fa4, #ec4899, #f59e0b, #10b981, #3b82f6, #1f5fa4)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulso del border-glow — respiración suave que llama la atención. */}
      <motion.div
        aria-hidden
        className="absolute -inset-1 rounded-3xl pointer-events-none"
        animate={{
          boxShadow: [
            "0 0 20px 0px rgba(255,255,255,0.25)",
            "0 0 40px 4px rgba(255,255,255,0.55)",
            "0 0 20px 0px rgba(255,255,255,0.25)",
          ],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Glass card original encima de los efectos */}
      <GlassEffect
        href={WHATSAPP_URL}
        className="relative z-10 rounded-3xl px-8 py-7 hover:px-9 hover:py-8 flex-col items-center"
      >
        <div className="flex flex-col items-center gap-4 text-white">
          <p className="text-sm uppercase tracking-[0.2em] opacity-80">
            WhatsApp Business
          </p>
          <div className="relative p-3 rounded-2xl bg-white/10">
            <div ref={ref} />
            <span className="absolute top-1 left-1 size-3 border-t-2 border-l-2 border-white/70 rounded-tl-md" />
            <span className="absolute top-1 right-1 size-3 border-t-2 border-r-2 border-white/70 rounded-tr-md" />
            <span className="absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-white/70 rounded-bl-md" />
            <span className="absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-white/70 rounded-br-md" />
          </div>
          <motion.p
            className="text-xs opacity-80 flex items-center gap-2"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
            Escanea o haz clic
          </motion.p>
        </div>
      </GlassEffect>
    </div>
  );
};

export default function Page() {
  const [loading, setLoading] = React.useState(true);

  // Bloquea el scroll mientras el preloader está visible para evitar
  // que el usuario active el scroll-driven hero antes de tiempo.
  React.useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <>
      {loading && <Preloader onComplete={() => setLoading(false)} />}
      <main
        className="relative w-full"
        style={{
          opacity: loading ? 0 : 1,
          transition: "opacity 0.8s ease-out 0.1s",
        }}
      >
        <GlassFilter />
        <ThemeToggle />
        <DebugGrid />

        {/* Bloque 1: Hero con círculo azul que crece + cross-fade B/N → color */}
        <section id="hero">
          <HeroCircle />
        </section>

        {/* Bloque 2: Manifiesto */}
        <section id="manifesto">
          <Manifesto />
        </section>

        {/* Bloque 3: Trayectoria */}
        <Companies />

        {/* Bloque 3.5: Carta de despedida (entry point especial) */}
        <LetterCard />

        {/* Bloque 4: Certificaciones */}
        <Certifications />

        {/* Bloque 5: Proyectos */}
        <Projects />

        {/* Bloque 4: Blog */}
        <Blog />

        {/* Bloque 5: QR de WhatsApp */}
        <section
          id="contacto"
          className="w-full flex items-center justify-center px-6 py-32 border-t"
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}
        >
          <WhatsAppQR />
        </section>

        {/* Bloque final: Footer */}
        <Footer />
      </main>
    </>
  );
}
