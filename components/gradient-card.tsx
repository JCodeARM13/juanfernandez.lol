"use client";

import React, { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * GradientCard — recreación del efecto "gradient hover card" (estilo Skiper90 /
 * Magic Bento / Glowing Effect): un glow radial que sigue el cursor + un borde
 * gradiente multicolor que aparece en hover. Theme-aware, sin dependencias.
 *
 * El movimiento del mouse se escribe como CSS vars (--gx, --gy) sobre el nodo;
 * el CSS (.gradient-card en globals.css) hace el resto.
 */
type GradientCardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export function GradientCard({
  children,
  className,
  ...props
}: GradientCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={cn("gradient-card group", className)}
      {...props}
    >
      <span aria-hidden className="gradient-card__border" />
      <span aria-hidden className="gradient-card__glow" />
      <div className="gradient-card__content">{children}</div>
    </div>
  );
}

export default GradientCard;
