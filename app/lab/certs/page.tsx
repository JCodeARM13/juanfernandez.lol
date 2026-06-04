"use client";

// RUTA DE PRUEBA AISLADA — solo renderiza la sección Certificaciones para
// probar el liquid glass + el easter egg de física sin cargar toda la landing.
// Quitar antes del deploy completo (o dejar como /lab oculto).

import React from "react";

import { Certifications } from "@/components/certifications";

export default function LabCertsPage() {
  const toggleTheme = () => {
    document.documentElement.classList.toggle("dark");
  };

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <button
        type="button"
        onClick={toggleTheme}
        style={{
          position: "fixed",
          top: 12,
          right: 12,
          zIndex: 100,
          padding: "6px 12px",
          borderRadius: 8,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--fg)",
          fontSize: 12,
          fontFamily: "monospace",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          cursor: "pointer",
        }}
      >
        tema
      </button>
      <Certifications />
    </main>
  );
}
