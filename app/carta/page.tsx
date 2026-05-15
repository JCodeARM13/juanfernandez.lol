"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play } from "lucide-react";
import { LetterContent } from "./letter-content";
import "./carta.css";

type Stage = "loading" | "gate" | "reading" | "fading" | "destroyed";

const CONSUMED_KEY = "carta-consumed";
const COUNTED_KEY = "carta-counted";

export default function CartaPage() {
  const [stage, setStage] = React.useState<Stage>("loading");
  const [viewCount, setViewCount] = React.useState<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = React.useRef<number | null>(null);

  // Mount: decide initial stage from localStorage
  React.useEffect(() => {
    try {
      const consumed = localStorage.getItem(CONSUMED_KEY);
      setStage(consumed === "1" ? "destroyed" : "gate");
    } catch {
      setStage("gate");
    }
    return () => {
      if (fadeTimeoutRef.current) window.clearTimeout(fadeTimeoutRef.current);
    };
  }, []);

  const incrementCounter = React.useCallback(async () => {
    try {
      const alreadyCounted = localStorage.getItem(COUNTED_KEY) === "1";
      if (alreadyCounted) {
        const r = await fetch("/api/carta-views", { cache: "no-store" });
        const data = await r.json();
        setViewCount(typeof data.count === "number" ? data.count : null);
        return;
      }
      const r = await fetch("/api/carta-views", {
        method: "POST",
        cache: "no-store",
      });
      const data = await r.json();
      setViewCount(typeof data.count === "number" ? data.count : null);
      localStorage.setItem(COUNTED_KEY, "1");
    } catch {
      // silent — counter is non-critical
    }
  }, []);

  const handleEnter = React.useCallback(() => {
    setStage("reading");
    void incrementCounter();
    // Start audio. Browsers permit playback inside this user gesture.
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Si el autoplay falla por algún motivo, no rompemos la lectura.
      });
    }
  }, [incrementCounter]);

  const handleSongEnded = React.useCallback(() => {
    setStage("fading");
    fadeTimeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(CONSUMED_KEY, "1");
      } catch {
        // ignore
      }
      setStage("destroyed");
    }, 3200);
  }, []);

  return (
    <main className="carta-shell">
      <div aria-hidden className="carta-aurora" />

      {/* Audio element shared across stages */}
      <audio
        ref={audioRef}
        src="/letters/all-right.mp3"
        preload="auto"
        onEnded={handleSongEnded}
      />

      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.div
            key="loading"
            className="carta-state-loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {stage === "gate" && (
          <motion.div
            key="gate"
            className="carta-gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="carta-gate-inner"
            >
              <p className="carta-gate-eyebrow">Una carta · Abril 2026</p>
              <h1 className="carta-gate-title">Farewell Letter</h1>
              <p className="carta-gate-meta">
                Acompañada por una canción.
                <br />
                Cuando termine, la carta se va.
              </p>
              <button
                type="button"
                onClick={handleEnter}
                className="carta-gate-button"
                aria-label="Entrar a la carta"
              >
                <Play className="w-4 h-4" />
                <span>Entrar</span>
              </button>
              <p className="carta-gate-foot">
                Vas a escuchar audio. Sube el volumen si quieres.
              </p>
            </motion.div>
          </motion.div>
        )}

        {(stage === "reading" || stage === "fading") && (
          <motion.div
            key="reading"
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "fading" ? 0 : 1 }}
            transition={{
              duration: stage === "fading" ? 3 : 1.0,
              ease: "easeOut",
            }}
          >
            <LetterContent />
            {viewCount !== null && (
              <p className="carta-view-count">
                Has sido la lectura #{viewCount}
              </p>
            )}
          </motion.div>
        )}

        {stage === "destroyed" && (
          <motion.div
            key="destroyed"
            className="carta-destroyed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          >
            <Pelicano />
            <p className="carta-destroyed-text">
              La carta se fue con la canción.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

const Pelicano: React.FC = () => (
  <svg
    viewBox="0 0 200 200"
    width="180"
    height="180"
    aria-label="Pelicano"
    className="carta-pelican-svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Cuerpo */}
    <path d="M40 130 C 50 100, 90 90, 120 105 C 145 117, 155 135, 150 150 C 140 160, 100 162, 70 158 C 55 156, 42 150, 40 130 Z" />
    {/* Cuello */}
    <path d="M120 105 C 130 90, 140 75, 150 70" />
    {/* Cabeza */}
    <ellipse cx="153" cy="65" rx="14" ry="11" />
    {/* Pico superior */}
    <path d="M165 62 C 180 56, 195 60, 198 70" />
    {/* Pico bolsa */}
    <path d="M165 70 C 180 78, 195 76, 198 70" />
    {/* Ojo */}
    <circle cx="156" cy="62" r="1.2" fill="currentColor" />
    {/* Pata 1 */}
    <path d="M85 158 L 82 175 M82 175 L 75 178 M82 175 L 88 178" />
    {/* Pata 2 */}
    <path d="M115 160 L 118 175 M118 175 L 112 178 M118 175 L 124 178" />
    {/* Ala detalle */}
    <path d="M70 130 C 90 122, 110 125, 130 138" opacity="0.6" />
  </svg>
);
