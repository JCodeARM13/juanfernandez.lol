"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const CLAW_PIXELS = [
  "0011111111111100",
  "0011111111111100",
  "0011011001101100",
  "0011111111111100",
  "1111111111111111",
  "1111111111111111",
  "0011111111111100",
  "0011111111111100",
  "0011001001001100",
  "0011001001001100",
];

const PX = 8;
const REQUIRED_CLICKS = 7;

const ClawMonster: React.FC<{ color: string }> = ({ color }) => {
  const width = CLAW_PIXELS[0].length * PX;
  const height = CLAW_PIXELS.length * PX;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {CLAW_PIXELS.map((row, y) =>
        row.split("").map((cell, x) =>
          cell === "1" ? (
            <rect
              key={`${x}-${y}`}
              x={x * PX}
              y={y * PX}
              width={PX}
              height={PX}
              fill={color}
            />
          ) : null
        )
      )}
    </svg>
  );
};

export const EasterEgg: React.FC = () => {
  const [clicks, setClicks] = React.useState(0);
  const [show, setShow] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const [claimed, setClaimed] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const referralLink = "https://claude.ai/referral/jsGHA0hUNQ";

  const handleClick = React.useCallback(() => {
    if (dismissed) return;

    setClicks((prev) => {
      const next = prev + 1;
      if (next >= REQUIRED_CLICKS) {
        setShow(true);
        return 0;
      }
      return next;
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setClicks(0), 2000);
  }, [dismissed]);

  const dismiss = React.useCallback(() => {
    setShow(false);
    setDismissed(true);
  }, []);

  const handleClaim = React.useCallback(() => {
    setClaimed(true);
  }, []);

  const copyLink = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.open(referralLink, "_blank");
    }
  }, [referralLink]);

  return (
    <>
      <span
        onClick={handleClick}
        className="cursor-default select-none relative inline-flex items-center gap-1"
        style={{ userSelect: "none" }}
      >
        v4.6
        {clicks > 0 && !show && (
          <span className="inline-flex gap-[3px] ml-1">
            {Array.from({ length: REQUIRED_CLICKS }).map((_, i) => (
              <motion.span
                key={i}
                initial={i === clicks - 1 ? { scale: 0 } : false}
                animate={i === clicks - 1 ? { scale: 1 } : undefined}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  display: "inline-block",
                  background: i < clicks ? "#1f5fa4" : "rgba(255,255,255,0.15)",
                  boxShadow: i < clicks ? "0 0 6px rgba(31,95,164,0.6)" : "none",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              />
            ))}
          </span>
        )}
      </span>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={dismiss}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ background: "rgba(0, 0, 0, 0.85)", cursor: "pointer" }}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.3, opacity: 0, y: 40 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col items-center gap-6 rounded-3xl px-8 py-10 md:px-12 md:py-14 max-w-md mx-4 text-center"
              style={{
                background: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 100%)",
                border: "1px solid rgba(31, 95, 164, 0.3)",
                boxShadow:
                  "0 0 60px rgba(31, 95, 164, 0.15), 0 0 120px rgba(31, 95, 164, 0.05)",
              }}
            >
              <motion.button
                onClick={dismiss}
                whileHover={{ scale: 1.3, color: "rgba(255,255,255,0.8)" }}
                whileTap={{ scale: 0.9 }}
                className="absolute top-4 right-5 flex items-center justify-center"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  background: "transparent",
                  width: 32,
                  height: 32,
                  fontSize: "18px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: "color 0.2s",
                }}
              >
                ✕
              </motion.button>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ClawMonster color="#1f5fa4" />
              </motion.div>

              <div className="space-y-3" style={{ textTransform: "none", letterSpacing: "0", fontFamily: "inherit" }}>
                <p
                  className="text-xl md:text-2xl font-normal italic leading-snug"
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    color: "#f5f5f5",
                    textTransform: "none",
                    letterSpacing: "0",
                  }}
                >
                  ¡Atrapaste a Viernes
                  <br />
                  rondando por aqui!
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)", textTransform: "none", letterSpacing: "normal" }}
                >
                  Toma una semana de Claude Cowork y Code gratis,
                  cortesia de Juan.
                </p>
              </div>

              <div className="flex flex-col items-center gap-3 w-full">
                <AnimatePresence mode="wait">
                  {!claimed ? (
                    <motion.button
                      key="claim-btn"
                      onClick={handleClaim}
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
                      style={{
                        background: "#1f5fa4",
                        color: "#fff",
                        textTransform: "none",
                        letterSpacing: "normal",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Reclamar
                      <span style={{ fontSize: "16px" }}>😉</span>
                    </motion.button>
                  ) : (
                    <motion.div
                      key="link-reveal"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center gap-3 w-full"
                    >
                      <p
                        className="text-xs"
                        style={{ color: "rgba(255,255,255,0.45)", textTransform: "none", letterSpacing: "normal" }}
                      >
                        Link de uso unico. Copia y abrelo en tu navegador.
                      </p>
                      <div
                        className="flex items-center gap-2 rounded-lg px-4 py-2.5 w-full max-w-xs"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(31, 95, 164, 0.25)",
                        }}
                      >
                        <span
                          className="text-xs truncate flex-1 text-left"
                          style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", textTransform: "none", letterSpacing: "normal" }}
                        >
                          {referralLink}
                        </span>
                        <motion.button
                          onClick={copyLink}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs px-3 py-1 rounded-md shrink-0"
                          style={{
                            background: copied ? "#22c55e" : "#1f5fa4",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                            textTransform: "none",
                            letterSpacing: "normal",
                            transition: "background 0.2s",
                          }}
                        >
                          {copied ? "Copiado ✓" : "Copiar"}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEgg;
