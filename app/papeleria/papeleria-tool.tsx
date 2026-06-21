"use client";

import React from "react";
import { motion } from "framer-motion";
import { Printer, Download } from "lucide-react";

import { GradientCard } from "@/components/gradient-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuroraBackground } from "@/components/aurora-background";
import { render, printHTML } from "@/lib/papeleria/engine";
import catalogJson from "@/lib/papeleria/formats.json";

type Control = {
  key: string;
  label: string;
  type: "range" | "select" | "color" | "bool";
  min?: number;
  max?: number;
  step?: number;
  options?: (string | number)[];
};
type Format = {
  id: string;
  name: string;
  cat: string;
  draw: string;
  desc: string;
  params: Record<string, unknown>;
  controls: Control[];
};

const CATALOG = catalogJson as unknown as {
  meta: { universalControls: Control[] };
  formats: Format[];
};
const FORMATS = CATALOG.formats;
const UNIVERSAL = CATALOG.meta.universalControls;
const CATS = ["Todos", ...Array.from(new Set(FORMATS.map((f) => f.cat)))];

export default function PapeleriaTool() {
  const [category, setCategory] = React.useState("Todos");
  const [fmtId, setFmtId] = React.useState(FORMATS[0].id);
  const [params, setParams] = React.useState<Record<string, unknown>>({});

  const stageRef = React.useRef<HTMLDivElement>(null);
  const current = React.useRef<{ svg: string; w: number; h: number } | null>(null);

  const fmt = FORMATS.find((f) => f.id === fmtId) ?? FORMATS[0];

  const curVal = (key: string, fallback: unknown) => {
    if (key in params) return params[key];
    if (fmt.params && key in fmt.params) return fmt.params[key];
    return fallback;
  };
  const setParam = (k: string, v: unknown) => setParams((p) => ({ ...p, [k]: v }));

  // Render del SVG al cambiar formato o parámetros (DOM seguro, sin innerHTML)
  React.useEffect(() => {
    try {
      const out = render(fmtId, params, FORMATS) as { svg: string; w: number; h: number };
      current.current = { svg: out.svg, w: out.w, h: out.h };
      const stage = stageRef.current;
      if (stage) {
        const doc = new DOMParser().parseFromString(out.svg, "image/svg+xml");
        const svg = doc.documentElement;
        svg.setAttribute("style", "display:block;max-width:72vw;max-height:82vh;width:auto;height:auto");
        stage.replaceChildren(svg);
      }
    } catch {
      /* parámetros en transición; el siguiente render corrige */
    }
  }, [fmtId, params]);

  const selectFormat = (f: Format) => {
    setFmtId(f.id);
    setParams({});
  };

  // Imprimir: HTML a tamaño @page exacto en un iframe oculto vía Blob URL.
  const doPrint = () => {
    const cur = current.current;
    if (!cur) return;
    const html = printHTML(cur.svg, cur.w, cur.h) as string;
    const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
    const ifr = document.createElement("iframe");
    ifr.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
    ifr.onload = () => {
      ifr.contentWindow?.focus();
      ifr.contentWindow?.print();
      setTimeout(() => {
        ifr.remove();
        URL.revokeObjectURL(url);
      }, 1500);
    };
    ifr.src = url;
    document.body.appendChild(ifr);
  };

  const doDownloadSVG = () => {
    const cur = current.current;
    if (!cur) return;
    const blob = new Blob([cur.svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${fmtId}-${String(curVal("size", "A4"))}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const renderControl = (c: Control) => {
    const v = curVal(c.key, c.type === "bool" ? false : c.type === "range" ? c.min : "");
    const labelCls =
      "flex items-center justify-between mb-1.5 font-mono text-[10px] uppercase tracking-[0.08em]";
    if (c.type === "range")
      return (
        <div key={c.key} className="mb-4">
          <label className={labelCls} style={{ color: "var(--muted)" }}>
            <span>{c.label}</span>
            <b className="font-semibold tabular-nums text-[11px]" style={{ color: "var(--fg)" }}>
              {String(v)}
            </b>
          </label>
          <input
            type="range"
            min={c.min}
            max={c.max}
            step={c.step}
            value={Number(v)}
            onChange={(e) => setParam(c.key, Number(e.target.value))}
            className="w-full"
            style={{ accentColor: "var(--circle)" }}
          />
        </div>
      );
    if (c.type === "select")
      return (
        <div key={c.key} className="mb-4">
          <label className={labelCls} style={{ color: "var(--muted)" }}>
            {c.label}
          </label>
          <select
            value={String(v)}
            onChange={(e) => {
              const raw = e.target.value;
              setParam(c.key, raw !== "" && !isNaN(Number(raw)) ? Number(raw) : raw);
            }}
            className="w-full rounded-lg px-2.5 py-1.5 text-sm outline-none"
            style={{ background: "var(--bg)", color: "var(--fg)", border: "1px solid var(--border)" }}
          >
            {c.options?.map((o) => (
              <option key={String(o)} value={String(o)}>
                {String(o)}
              </option>
            ))}
          </select>
        </div>
      );
    if (c.type === "color")
      return (
        <div key={c.key} className="mb-4">
          <label className={labelCls} style={{ color: "var(--muted)" }}>
            {c.label}
          </label>
          <input
            type="color"
            value={String(v || "#1f5fa4")}
            onChange={(e) => setParam(c.key, e.target.value)}
            className="h-9 w-full cursor-pointer rounded-lg p-0.5"
            style={{ background: "var(--bg)", border: "1px solid var(--border)" }}
          />
        </div>
      );
    return (
      <label
        key={c.key}
        className="mb-4 flex cursor-pointer items-center gap-2 font-mono text-[10px] uppercase tracking-[0.08em]"
        style={{ color: "var(--muted)" }}
      >
        <input
          type="checkbox"
          checked={Boolean(v)}
          onChange={(e) => setParam(c.key, e.target.checked)}
          className="size-4"
          style={{ accentColor: "var(--circle)" }}
        />
        {c.label}
      </label>
    );
  };

  const visible = FORMATS.filter((f) => category === "Todos" || f.cat === category);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--bg)", color: "var(--fg)" }}>
      <ThemeToggle />

      {/* Sidebar */}
      <aside
        className="z-10 flex w-[348px] shrink-0 flex-col"
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border)" }}
      >
        <header className="px-5 pb-3.5 pt-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <h1 className="font-display flex items-center gap-2.5 text-[30px] italic leading-none">
            <span
              className="block size-3 shrink-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg,#1f5fa4,#ec4899,#f59e0b,#10b981,#3b82f6,#1f5fa4)",
                boxShadow: "0 0 14px color-mix(in oklab, var(--circle) 60%, transparent)",
              }}
            />
            Papelería
          </h1>
          <p className="mt-1.5 text-base" style={{ color: "var(--muted)", fontFamily: "Caveat, cursive" }}>
            cualquier hoja, a tu medida — e imprímela
          </p>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* categorías */}
          <div className="mb-4 flex flex-wrap gap-1.5">
            {CATS.map((c) => {
              const on = c === category;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className="rounded-full px-3 py-[5px] font-mono text-[10px] uppercase tracking-[0.14em] transition-colors"
                  style={{
                    border: `1px solid ${on ? "var(--circle)" : "var(--border)"}`,
                    background: on ? "var(--circle)" : "transparent",
                    color: on ? "var(--circle-fg)" : "var(--muted)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* formatos */}
          <div className="mb-5 grid grid-cols-2 gap-2.5">
            {visible.map((f) => {
              const on = f.id === fmtId;
              return (
                <GradientCard
                  key={f.id}
                  onClick={() => selectFormat(f)}
                  className="cursor-pointer rounded-xl transition-transform duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "var(--bg)",
                    border: `1px solid ${on ? "var(--circle)" : "var(--border)"}`,
                    boxShadow: on
                      ? "0 0 0 1px var(--circle),0 6px 20px color-mix(in oklab,var(--circle) 22%,transparent)"
                      : "none",
                  }}
                >
                  <div className="p-3">
                    <b
                      className="block text-[13px] font-semibold"
                      style={{ color: on ? "var(--circle)" : "var(--fg)" }}
                    >
                      {f.name}
                    </b>
                    <span className="mt-0.5 block text-[11px] leading-snug" style={{ color: "var(--muted)" }}>
                      {f.desc}
                    </span>
                  </div>
                </GradientCard>
              );
            })}
          </div>

          {/* controles */}
          <div>
            {fmt.controls?.map(renderControl)}
            <div className="my-2 h-px" style={{ background: "var(--border)" }} />
            {UNIVERSAL.map(renderControl)}
          </div>
        </div>

        <footer className="flex gap-2 px-5 py-3.5" style={{ borderTop: "1px solid var(--border)" }}>
          <button
            onClick={doPrint}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-transform active:scale-[0.97]"
            style={{
              background: "var(--circle)",
              color: "var(--circle-fg)",
              boxShadow: "0 6px 18px color-mix(in oklab,var(--circle) 35%,transparent)",
            }}
          >
            <Printer className="size-4" /> Imprimir
          </button>
          <button
            onClick={doDownloadSVG}
            className="glass-card flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold"
            style={{ color: "var(--fg)" }}
          >
            <Download className="size-4" /> SVG
          </button>
          <button
            onClick={doPrint}
            className="glass-card flex items-center justify-center rounded-xl px-3.5 py-2.5 text-sm font-semibold"
            style={{ color: "var(--fg)" }}
            title="PDF vía diálogo → Guardar como PDF"
          >
            PDF
          </button>
        </footer>
      </aside>

      {/* Stage con aurora real */}
      <AuroraBackground className="min-h-0 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          ref={stageRef}
          className="relative z-10 rounded-[3px] bg-white"
          style={{ boxShadow: "0 1px 2px rgba(15,23,42,.1),0 18px 60px rgba(15,23,42,.18)" }}
        />
      </AuroraBackground>
    </div>
  );
}
