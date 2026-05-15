# Fix Image Loading + Dark Mode Bugs — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar el flash blanco al cargar (FOUC), arreglar el botón de tema que aparece tarde, hacer que la transición de View Transitions sea consistente en ambas direcciones, y diagnosticar/arreglar por qué los PNGs no cargan.

**Architecture:** El FOUC se resuelve con un script inline blocking en `<head>` (vía `next/script` con `strategy="beforeInteractive"`) que aplica `.dark` ANTES de que React hidrate. El botón se renderiza siempre y lee el theme actual del DOM (no del estado React) para evitar el `mounted` gate. El CSS de View Transitions se simplifica a una sola regla por dirección, sin depender del orden de aplicación de la clase. Los PNGs se prueban con un archivo conocido para descartar iCloud `.icloud` placeholder vs problema de path.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, framer-motion, Netlify deploy.

---

## Task 1: Eliminar FOUC con Script blocking en `<head>`

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Importar `Script` de `next/script` y agregar el inicializador de tema**

```tsx
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juan Fernández",
  description: "juanfernandez.lol",
};

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('jfn-theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    if (theme === 'dark') document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verificar build pasa**

Run: `npm run build`
Expected: PASS, sin warnings nuevos.

---

## Task 2: Limpiar `ThemeToggle` — quitar gate `mounted`, leer del DOM

**Files:**
- Modify: `components/theme-toggle.tsx`

- [ ] **Step 1: Reescribir el componente sin el gate `mounted`**

El theme se lee directamente del DOM (`<html>` ya tiene `.dark` aplicado por el script de Task 1). El estado React solo se usa para cambiar el ícono.

```tsx
"use client";

import React from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "jfn-theme";

type DocumentWithVT = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

function readCurrentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = React.useState<Theme>(readCurrentTheme);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setTheme(readCurrentTheme());
  }, []);

  const applyTheme = (next: Theme) => {
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(STORAGE_KEY, next);
  };

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const doc = document as DocumentWithVT;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduceMotion) {
      applyTheme(next);
      return;
    }

    const button = buttonRef.current;
    const rect = button?.getBoundingClientRect();
    const cx = rect ? rect.left + rect.width / 2 : window.innerWidth - 30;
    const cy = rect ? rect.top + rect.height / 2 : 30;
    const maxR = Math.hypot(
      Math.max(cx, window.innerWidth - cx),
      Math.max(cy, window.innerHeight - cy)
    );

    const transition = doc.startViewTransition(() => applyTheme(next));
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            \`circle(0px at \${cx}px \${cy}px)\`,
            \`circle(\${maxR}px at \${cx}px \${cy}px)\`,
          ],
        },
        {
          duration: 700,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggle}
      aria-label="Cambiar tema"
      suppressHydrationWarning
      className="fixed top-5 right-5 z-50 size-10 rounded-full border border-zinc-300 dark:border-zinc-700
                 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md
                 flex items-center justify-center
                 text-zinc-800 dark:text-zinc-100
                 transition-colors hover:bg-white dark:hover:bg-zinc-800"
    >
      {theme === "dark" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
};
```

- [ ] **Step 2: Verificar build pasa**

Run: `npm run build`
Expected: PASS.

---

## Task 3: Simplificar CSS de View Transitions

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Reemplazar las reglas de view-transition con una versión que no depende del orden `.dark`**

Buscar el bloque actual en `app/globals.css`:

```css
/* View Transitions API: animación circular para el theme toggle */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 1;
}
::view-transition-new(root) {
  z-index: 9999;
}
.dark::view-transition-old(root) {
  z-index: 9999;
}
.dark::view-transition-new(root) {
  z-index: 1;
}
```

Reemplazar por:

```css
/* View Transitions API: el nuevo tema entra con clip-path circular sobre el viejo */
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-old(root) {
  z-index: 1;
}
::view-transition-new(root) {
  z-index: 2;
}
```

- [ ] **Step 2: Verificar build pasa**

Run: `npm run build`
Expected: PASS.

---

## Task 4: Diagnosticar bug del PNG (BLOCKED — necesita info de Juan)

**Files:**
- Inspect: `public/`
- Modify (potencial): `next.config.ts`, `components/hero-circle.tsx`

- [ ] **Step 1: Pedir a Juan el archivo PNG exacto que falló**

Necesito el PNG real (o screenshot del error en consola del navegador) para diagnosticar. Hipótesis a descartar:
- a) iCloud `.icloud` placeholder no descargado (verificar con `ls -la@` y `xattr` en el archivo)
- b) Case sensitivity (`Juan.png` vs `juan.png`)
- c) Tamaño del PNG > límite de Netlify
- d) MIME-type incorrecto

- [ ] **Step 2: Si el problema es `.icloud` placeholder, forzar download antes de deploy**

Run: `brctl download "<path al png>"` antes de `netlify deploy`. Documentar en README del proyecto.

- [ ] **Step 3: Si el problema es runtime/missing, agregar fallback a JPG en el componente**

En `components/hero-circle.tsx`, si la imagen PNG falla con `onError`, intentar el JPG equivalente antes de mostrar el placeholder:

```tsx
const [colorSrc, setColorSrc] = React.useState(imageColorSrc);
// ...
<motion.img
  src={colorSrc}
  onError={() => {
    if (colorSrc.endsWith('.png')) {
      setColorSrc(colorSrc.replace('.png', '.jpg'));
    } else {
      setColorError(true);
    }
  }}
  // ...
/>
```

---

## Task 5: Build + deploy + verificar en producción

- [ ] **Step 1: Build local**

Run: `cd 01_JUAN/juanfernandez.lol-v3 && npm run build`
Expected: PASS, sin errores.

- [ ] **Step 2: Deploy a producción**

Run: `netlify deploy --prod`
Expected: deploy live en `https://juanfernandez.lol`.

- [ ] **Step 3: Verificación manual en navegador**

Abrir `https://juanfernandez.lol` en navegador con preferencia "dark":
- ¿Se ve flash blanco al cargar? Debe ser NO.
- ¿El botón de tema aparece desde el primer frame? Debe ser SÍ.
- Click toggle: ¿la transición circular funciona? En Chrome/Edge/Safari moderno SÍ; en Firefox cae a switch instantáneo.

Repetir en otro navegador con preferencia "light".

---

## Notas

- **Task 4 está bloqueada** hasta que Juan provea el PNG real o el error de consola. No invento un fix sin diagnóstico.
- Tasks 1, 2, 3 y 5 se pueden ejecutar inmediatamente — son fixes con causa raíz identificada en el código actual.
- Si después del deploy el dark mode sigue con problemas en un navegador específico, levantar como nuevo plan.
