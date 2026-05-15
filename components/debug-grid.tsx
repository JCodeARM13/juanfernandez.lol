"use client";

import React from "react";

/**
 * Grid de 12 columnas visible solo cuando la URL trae ?grid=1.
 * Útil para alinear bloques durante el desarrollo, invisible para usuarios.
 */
export const DebugGrid: React.FC = () => {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setShow(params.get("grid") === "1");
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] pointer-events-none">
      <div className="h-full max-w-7xl mx-auto grid grid-cols-12 gap-4 px-6 md:px-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-full border-x border-red-500/40 bg-red-500/5"
          />
        ))}
      </div>
      <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[9999] text-[10px] uppercase tracking-widest text-red-600 bg-white/90 dark:bg-zinc-900/90 px-2 py-1 rounded">
        grid · 12 cols · remove ?grid=1 to hide
      </div>
    </div>
  );
};
