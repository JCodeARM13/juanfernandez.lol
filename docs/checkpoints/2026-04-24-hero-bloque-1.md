# Checkpoint — 2026-04-24 — Hero (Bloque 1) completo

## Estado del deploy

- **URL prod:** https://juanfernandez.lol
- **Último deploy:** `69eb643a56bb04cda021f6c5`
- **Site Netlify:** `juan-fernandez-cx`

## Qué quedó shippeado en este checkpoint

**Hero (Bloque 1)**
- Nav glass arriba con "Juan Fernández" + "v3.0", texto con `mix-blend-difference` (visible sobre cualquier fondo)
- Footer glass abajo con "Tlalnepantla, MX" + "scroll ↓", también con `mix-blend-difference`
- Imagen central: PNG con fondo transparente (procesada con Pillow desde JPG original)
- Cross-fade B/N → color dirigido por scroll
- Círculo azul `#1f5fa4` (var `--brand-blue`) que escala de 1× a 22× con scroll, cubre todo el viewport
- Círculo dimensiones base: 460/620/760px (móvil/tablet/desktop)
- Imagen dimensiones: 68vh, w 280/340/400px
- Layout: 2 cols (imagen izq, tipografía gigante "Juan. Fernández." der)

**Dark mode**
- Script blocking `beforeInteractive` en `<head>` aplica `.dark` antes de hidratar → sin FOUC
- ThemeToggle sin gate `mounted` → botón visible desde frame 1
- View Transitions API con clip-path circular desde el botón (700ms, easing custom)
- Fallback automático en navegadores sin VT API o `prefers-reduced-motion`
- `localStorage` key `jfn-theme`

**Bloques pendientes en la página**
- Section azul vacía (~60vh) reservada para próximas secciones
- QR de WhatsApp Business al final (link `wa.me/525548869123`)

## Stack

- Next.js 16.2.4 (App Router, Turbopack)
- React 19.0.0
- Tailwind v4 (`@tailwindcss/postcss`)
- framer-motion 12.x
- qr-code-styling 1.9.2
- TypeScript 5.7.3

## Estructura clave

```
01_JUAN/juanfernandez.lol-v3/
├── app/
│   ├── layout.tsx        ← Script beforeInteractive theme-init
│   ├── page.tsx          ← Hero + spacer + QR
│   ├── globals.css       ← vars colores, view-transitions, dark mode
│   └── icon.svg          ← favicon (J en círculo azul)
├── components/
│   ├── hero-circle.tsx   ← Bloque 1 (animación scroll, cross-fade)
│   ├── glass.tsx         ← GlassEffect + GlassFilter (reusables)
│   ├── theme-toggle.tsx  ← View Transitions + persistencia
│   └── aurora-background.tsx  ← guardado para futuro, no usado ahora
├── public/
│   ├── juan-bn.png       ← B/N transparente (Pillow threshold 235-250)
│   ├── juan-color.png    ← color transparente
│   ├── juan-bn.jpg       ← original JPG (kept as backup)
│   ├── juan-color.jpg    ← original JPG (kept as backup)
│   └── juan-side.jpg     ← perfil mirando derecha (no usado)
├── lib/utils.ts          ← cn helper (clsx + tailwind-merge)
└── docs/
    ├── superpowers/plans/2026-04-24-fix-images-and-darkmode.md
    └── checkpoints/2026-04-24-hero-bloque-1.md  ← este archivo
```

## Decisiones técnicas

1. **PNG vs JPG con `mix-blend-multiply`**: el blend fallaba porque el wrapper `relative z-10` creaba stacking context aislado. Solución: PNG con alpha real procesado con Pillow.
2. **`mix-blend-difference` en glass nav/footer**: hace que el texto blanco se invierta automáticamente según el fondo (blanco→negro, azul→amarillo), garantiza legibilidad sobre cualquier sección.
3. **`node_modules` queda dentro de iCloud** porque npm reemplazó el symlink al instalar. No causa problemas de build hasta ahora.
4. **Hero siempre fondo blanco** (no respeta dark mode) para evitar halos de PNG sobre fondo oscuro. El dark mode aplica al resto de la página.
5. **Próximas secciones** entran como `<section>` debajo del Hero. Usar `<GlassEffect>` para mantener consistencia visual.

## Cómo retomar

Para añadir el siguiente bloque (sobre, proyectos, contacto, etc.):

1. Abrir `app/page.tsx`
2. Agregar nueva `<section>` entre el spacer y el QR final
3. Importar componentes glass si se reutilizan
4. `cd 01_JUAN/juanfernandez.lol-v3 && npm run build && netlify deploy --prod`

Para hacer cambios al hero:
- Animación scroll: `components/hero-circle.tsx` líneas con `useTransform`
- Tipografía: `components/hero-circle.tsx` `<h1>` text-* clases
- Color: `app/globals.css` var `--brand-blue`

Para regenerar PNGs si Juan envía nuevas fotos:
```bash
cd 01_JUAN/juanfernandez.lol-v3 && python3 -c "
from PIL import Image
def remove_bg(inp, out):
    img = Image.open(inp).convert('RGBA')
    px = img.load()
    for y in range(img.size[1]):
        for x in range(img.size[0]):
            r,g,b,_ = px[x,y]
            mv = min(r,g,b)
            if mv >= 250: px[x,y] = (r,g,b,0)
            elif mv >= 235: px[x,y] = (r,g,b, int(255*(250-mv)/15))
    img.save(out, 'PNG', optimize=True)
remove_bg('public/INPUT.jpg', 'public/OUTPUT.png')
"
```

## Issues abiertos

- (ninguno crítico)

## Próximo bloque sugerido

Cuando Juan dé luz verde: agregar bloque 2 (sobre, proyectos, o lo que decida) entre el spacer azul y el QR.
