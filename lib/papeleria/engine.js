// Papelería — motor de render de hojas imprimibles.
// ESM puro, sin dependencias. Corre igual en navegador (web jcfvg.com) y en Node (CLI local).
// Idea: cada hoja se dibuja como SVG a tamaño de página EXACTO (unidades = mm),
// para que impresa salga a escala real edge-to-edge.

export const SIZES = {
  A3:    [297, 420],
  A4:    [210, 297],
  A5:    [148, 210],
  A6:    [105, 148],
  Carta: [215.9, 279.4],   // Letter
  Letter:[215.9, 279.4],
  Oficio:[215.9, 355.6],   // Legal
  Legal: [215.9, 355.6],
};

// ---- helpers de dibujo --------------------------------------------------
const r = n => Math.round(n * 1000) / 1000;
const ln = (x1, y1, x2, y2, c, w, extra = '') =>
  `<line x1="${r(x1)}" y1="${r(y1)}" x2="${r(x2)}" y2="${r(y2)}" stroke="${c}" stroke-width="${r(w)}"${extra ? ' ' + extra : ''}/>`;
const dash = (x1, y1, x2, y2, c, w, d) =>
  ln(x1, y1, x2, y2, c, w, `stroke-dasharray="${d}"`);
const circle = (cx, cy, rad, fill) =>
  `<circle cx="${r(cx)}" cy="${r(cy)}" r="${r(rad)}" fill="${fill}"/>`;
const rectEl = (x, y, w, h, attrs = '') =>
  `<rect x="${r(x)}" y="${r(y)}" width="${r(w)}" height="${r(h)}" ${attrs}/>`;
const txt = (x, y, s, size, fill = '#666', anchor = 'start') =>
  `<text x="${r(x)}" y="${r(y)}" font-family="Helvetica,Arial,sans-serif" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${s}</text>`;
const frame = (x, y, w, h, c, sw = 0.4) =>
  rectEl(x, y, w, h, `fill="none" stroke="${c}" stroke-width="${sw}"`);

// ---- resolución de parámetros + clamp -----------------------------------
function resolve(def, user) {
  const p = Object.assign(
    { size: 'A4', orientation: 'portrait', lineColor: '#9db4d0',
      bgColor: '#ffffff', lineWeight: 0.25, margin: 8 },
    def.params || {},
    user || {}
  );
  for (const c of (def.controls || [])) {
    if (c.type === 'range' && typeof p[c.key] === 'number') {
      if (c.min != null) p[c.key] = Math.max(c.min, p[c.key]);
      if (c.max != null) p[c.key] = Math.min(c.max, p[c.key]);
    }
  }
  return p;
}

// =========================================================================
//  Familias de dibujo. Cada una recibe ctx={w,h,p} y devuelve el SVG interno.
// =========================================================================
const DRAW = {
  // -------- cuaderno ----------------------------------------------------
  grid(ctx) {
    const { w, h, p } = ctx, m = p.margin, s = p.spacing;
    const inW = w - 2 * m, inH = h - 2 * m;
    const nx = Math.floor(inW / s), ny = Math.floor(inH / s);
    const ox = m + (inW - nx * s) / 2, oy = m + (inH - ny * s) / 2;
    const o = [];
    for (let i = 0; i <= nx; i++) o.push(ln(ox + i * s, oy, ox + i * s, oy + ny * s, p.lineColor, p.lineWeight));
    for (let j = 0; j <= ny; j++) o.push(ln(ox, oy + j * s, ox + nx * s, oy + j * s, p.lineColor, p.lineWeight));
    return o.join('');
  },

  ruled(ctx) {
    const { w, h, p } = ctx, m = p.margin, s = p.spacing;
    const o = [];
    for (let y = m + s; y <= h - m + 1e-6; y += s) o.push(ln(m, y, w - m, y, p.lineColor, p.lineWeight));
    if (p.marginLine) {
      const mx = m + (p.marginLeft ?? 28);
      o.push(ln(mx, m, mx, h - m, p.marginColor || '#e7a2a2', p.lineWeight * 1.4));
    }
    return o.join('');
  },

  dots(ctx) {
    const { w, h, p } = ctx, m = p.margin, s = p.spacing;
    const inW = w - 2 * m, inH = h - 2 * m;
    const nx = Math.floor(inW / s), ny = Math.floor(inH / s);
    const ox = m + (inW - nx * s) / 2, oy = m + (inH - ny * s) / 2;
    const o = [];
    for (let i = 0; i <= nx; i++)
      for (let j = 0; j <= ny; j++)
        o.push(circle(ox + i * s, oy + j * s, p.dotRadius || 0.35, p.lineColor));
    return o.join('');
  },

  blank(ctx) {
    const { w, h, p } = ctx, m = p.margin;
    return p.frame ? frame(m, m, w - 2 * m, h - 2 * m, p.lineColor) : '';
  },

  // -------- técnicos ----------------------------------------------------
  iso(ctx) {
    const { w, h, p } = ctx, m = p.margin, s = p.spacing, c = p.lineColor, sw = p.lineWeight;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m;
    const k = Math.tan(Math.PI / 6); // 30°
    const fam = (slope) => {
      const bs = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => y - slope * x);
      const bMin = Math.min(...bs), bMax = Math.max(...bs), out = [];
      for (let b = Math.floor(bMin / s) * s; b <= bMax; b += s)
        out.push(ln(x0, slope * x0 + b, x1, slope * x1 + b, c, sw));
      return out.join('');
    };
    const vert = [];
    for (let x = x0; x <= x1 + 1e-6; x += s) vert.push(ln(x, y0, x, y1, c, sw));
    return `<clipPath id="cp"><rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}"/></clipPath>`
      + `<g clip-path="url(#cp)">${fam(k)}${fam(-k)}${vert.join('')}</g>`;
  },

  hex(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m, R = p.hexSize ?? 8;
    const hsp = 1.5 * R, vsp = Math.sqrt(3) * R;
    const hexPath = (cx, cy) => {
      const pts = [];
      for (let i = 0; i < 6; i++) { const a = Math.PI / 180 * (60 * i); pts.push(`${r(cx + R * Math.cos(a))},${r(cy + R * Math.sin(a))}`); }
      return `<polygon points="${pts.join(' ')}"/>`;
    };
    const g = [`<g clip-path="url(#hcp)" fill="none" stroke="${c}" stroke-width="${r(p.lineWeight)}">`];
    let col = 0;
    for (let cx = x0; cx <= x1 + R; cx += hsp) {
      const yoff = (col % 2) ? vsp / 2 : 0;
      for (let cy = y0 + yoff; cy <= y1 + R; cy += vsp) g.push(hexPath(cx, cy));
      col++;
    }
    g.push('</g>');
    return `<clipPath id="hcp"><rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}"/></clipPath>` + g.join('');
  },

  mm(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m, o = [];
    const wt = i => (i % 10 === 0 ? 0.35 : i % 5 === 0 ? 0.22 : 0.1);
    const op = i => (i % 10 === 0 ? 0.9 : i % 5 === 0 ? 0.6 : 0.35);
    for (let x = x0; x <= x1 + 1e-6; x += 1) { const i = Math.round(x - x0); o.push(ln(x, y0, x, y1, c, wt(i), `stroke-opacity="${op(i)}"`)); }
    for (let y = y0; y <= y1 + 1e-6; y += 1) { const i = Math.round(y - y0); o.push(ln(x0, y, x1, y, c, wt(i), `stroke-opacity="${op(i)}"`)); }
    return o.join('');
  },

  semilog(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m, decades = p.decades || 4, s = p.spacing || 5;
    const decH = (y1 - y0) / decades, o = [];
    for (let x = x0, i = 0; x <= x1 + 1e-6; x += s, i++) o.push(ln(x, y0, x, y1, c, i % 5 === 0 ? 0.3 : 0.12));
    for (let d = 0; d < decades; d++)
      for (let k = 1; k <= 10; k++) {
        const yy = y1 - d * decH - decH * Math.log10(k);
        o.push(ln(x0, yy, x1, yy, c, (k === 1 || k === 10) ? 0.3 : 0.12));
      }
    return o.join('');
  },

  perspective(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m;
    const horizon = m + (h - 2 * m) * (p.horizon ?? 0.45);
    const pts = (p.points === 1)
      ? [[w * 0.5, horizon]]
      : [[x0 + (x1 - x0) * 0.12, horizon], [x1 - (x1 - x0) * 0.12, horizon]];
    const o = [ln(x0, horizon, x1, horizon, c, 0.4)];
    const rays = p.rays || 24, L = Math.max(w, h) * 1.6;
    for (const [vx, vy] of pts) {
      o.push(circle(vx, vy, 0.8, c));
      for (let i = 0; i < rays; i++) { const a = Math.PI * 2 * (i / rays); o.push(ln(vx, vy, vx + Math.cos(a) * L, vy + Math.sin(a) * L, c, 0.12)); }
    }
    return `<clipPath id="pcp"><rect x="${r(x0)}" y="${r(y0)}" width="${r(x1 - x0)}" height="${r(y1 - y0)}"/></clipPath>`
      + `<g clip-path="url(#pcp)">${o.join('')}</g>`;
  },

  // -------- estudio -----------------------------------------------------
  cornell(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m;
    const headerH = p.headerH ?? 18, cue = p.cueWidth ?? 62, summaryH = p.summaryH ?? 48;
    const nTop = y0 + headerH, nBot = y1 - summaryH, s = p.lineSpacing ?? 8, o = [];
    o.push(frame(x0, y0, x1 - x0, y1 - y0, c));
    o.push(ln(x0, nTop, x1, nTop, c, 0.4));
    o.push(ln(x0 + cue, nTop, x0 + cue, nBot, c, 0.4));
    o.push(ln(x0, nBot, x1, nBot, c, 0.4));
    for (let y = nTop + s; y < nBot; y += s) o.push(ln(x0 + cue + 2, y, x1, y, c, p.lineWeight));
    o.push(txt(x0 + 3, y0 + headerH - 5, 'Tema / Fecha', 4, '#999'));
    o.push(txt(x0 + 3, nBot + 8, 'Resumen', 4, '#999'));
    return o.join('');
  },

  plannerDay(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m;
    const headerH = p.headerH ?? 22, sideW = p.sideWidth ?? 55;
    const startH = p.startHour ?? 6, endH = p.endHour ?? 22;
    const schedR = x1 - sideW - 4, slots = endH - startH;
    const slotH = (y1 - (y0 + headerH)) / slots, o = [];
    o.push(frame(x0, y0, x1 - x0, y1 - y0, c));
    o.push(ln(x0, y0 + headerH, x1, y0 + headerH, c, 0.4));
    o.push(txt(x0 + 3, y0 + 9, 'FECHA', 5, '#777'));
    o.push(ln(x0 + 28, y0 + 11, x1 - 3, y0 + 11, c, 0.3));
    for (let i = 0; i <= slots; i++) {
      const y = y0 + headerH + i * slotH;
      o.push(ln(x0, y, schedR, y, c, p.lineWeight));
      if (i < slots) {
        o.push(txt(x0 + 3, y + slotH / 2 + 1.3, String(startH + i).padStart(2, '0') + ':00', 3.4, '#999'));
        o.push(dash(x0 + 14, y + slotH / 2, schedR, y + slotH / 2, c, p.lineWeight * 0.5, '1 1.5'));
      }
    }
    o.push(ln(x0 + 13, y0 + headerH, x0 + 13, y1, c, 0.25));
    o.push(ln(schedR + 2, y0 + headerH, schedR + 2, y1, c, 0.4));
    o.push(txt(schedR + 6, y0 + headerH + 8, 'PRIORIDADES', 4, '#777'));
    let sy = y0 + headerH + 14;
    for (let k = 0; k < 3; k++) { o.push(rectEl(schedR + 6, sy - 3, 3.5, 3.5, `fill="none" stroke="${c}" stroke-width="0.3"`)); o.push(ln(schedR + 11, sy, x1 - 3, sy, c, p.lineWeight)); sy += 8; }
    o.push(txt(schedR + 6, sy + 4, 'NOTAS', 4, '#777')); sy += 10;
    while (sy < y1 - 3) { o.push(ln(schedR + 6, sy, x1 - 3, sy, c, p.lineWeight)); sy += 7; }
    return o.join('');
  },

  plannerWeek(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m, headerH = p.headerH ?? 10;
    const days = p.weekStart === 'sun'
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const colW = (x1 - x0) / 7, o = [frame(x0, y0, x1 - x0, y1 - y0, c)];
    o.push(ln(x0, y0 + headerH, x1, y0 + headerH, c, 0.4));
    for (let i = 0; i < 7; i++) { const cx = x0 + i * colW; if (i > 0) o.push(ln(cx, y0, cx, y1, c, 0.3)); o.push(txt(cx + colW / 2, y0 + headerH - 3, days[i], 4.5, '#666', 'middle')); }
    const s = p.lineSpacing ?? 8;
    for (let y = y0 + headerH + s; y < y1; y += s) o.push(ln(x0, y, x1, y, c, p.lineWeight * 0.6));
    return o.join('');
  },

  calendar(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m, titleH = p.titleH ?? 16, dowH = p.dowH ?? 8;
    const days = p.weekStart === 'sun'
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const gTop = y0 + titleH + dowH, colW = (x1 - x0) / 7, rowH = (y1 - gTop) / 6, o = [];
    let title = p.title || '';
    if (!title && p.month && p.year) { const mn = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']; title = `${mn[p.month - 1]} ${p.year}`; }
    o.push(txt((x0 + x1) / 2, y0 + 11, title || '________________', 7, '#555', 'middle'));
    for (let i = 0; i < 7; i++) o.push(txt(x0 + i * colW + colW / 2, gTop - 2.5, days[i], 4, '#777', 'middle'));
    o.push(frame(x0, gTop, x1 - x0, y1 - gTop, c));
    for (let i = 1; i < 7; i++) o.push(ln(x0 + i * colW, gTop, x0 + i * colW, y1, c, 0.3));
    for (let j = 1; j < 6; j++) o.push(ln(x0, gTop + j * rowH, x1, gTop + j * rowH, c, 0.3));
    if (p.month && p.year) {
      const first = new Date(p.year, p.month - 1, 1).getDay();
      const offset = p.weekStart === 'sun' ? first : (first + 6) % 7;
      const dim = new Date(p.year, p.month, 0).getDate();
      for (let d = 1; d <= dim; d++) { const cell = offset + d - 1, cc = cell % 7, rr = Math.floor(cell / 7); o.push(txt(x0 + cc * colW + 2.5, gTop + rr * rowH + 5, String(d), 3.6, '#999')); }
    }
    return o.join('');
  },

  habit(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m;
    const labelW = p.labelWidth ?? 45, headerH = p.headerH ?? 10, habits = p.habits ?? 15, days = p.days ?? 31;
    const gL = x0 + labelW, gT = y0 + headerH, colW = (x1 - gL) / days, rowH = (y1 - gT) / habits, o = [];
    o.push(frame(x0, y0, x1 - x0, y1 - y0, c));
    o.push(ln(x0, gT, x1, gT, c, 0.4));
    o.push(ln(gL, y0, gL, y1, c, 0.4));
    o.push(txt(x0 + 2, y0 + headerH - 3, 'HÁBITO', 4, '#777'));
    for (let i = 1; i <= days; i++) { const cx = gL + i * colW; if (i < days) o.push(ln(cx, gT, cx, y1, c, 0.18)); o.push(txt(gL + (i - 1) * colW + colW / 2, gT - 2.5, String(i), 2.6, '#aaa', 'middle')); }
    for (let j = 1; j < habits; j++) o.push(ln(x0, gT + j * rowH, x1, gT + j * rowH, c, 0.18));
    return o.join('');
  },

  todo(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, y0 = m, x1 = w - m, y1 = h - m, s = p.spacing ?? 11, box = p.box !== false, o = [];
    o.push(txt(x0, y0 + 6, p.title || 'TO-DO', 6, '#666'));
    o.push(ln(x0, y0 + 9, x1, y0 + 9, c, 0.4));
    for (let y = y0 + 9 + s; y <= y1; y += s) {
      if (box) o.push(rectEl(x0, y - 3.8, 4, 4, `fill="none" stroke="${c}" stroke-width="0.3" rx="0.6"`));
      o.push(ln(x0 + (box ? 6 : 0), y, x1, y, c, p.lineWeight));
    }
    return o.join('');
  },

  // -------- música / especiales ----------------------------------------
  staff(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, x1 = w - m, staves = p.staves ?? 12, gap = p.staffGap ?? 1.8;
    const usable = h - 2 * m, staffH = 4 * gap, between = (usable - staves * staffH) / (staves + 1);
    const o = []; let y = m + between;
    for (let s = 0; s < staves; s++) {
      for (let i = 0; i < 5; i++) o.push(ln(x0, y + i * gap, x1, y + i * gap, c, p.lineWeight));
      o.push(ln(x0, y, x0, y + 4 * gap, c, p.lineWeight));
      o.push(ln(x1, y, x1, y + 4 * gap, c, p.lineWeight));
      y += staffH + between;
    }
    return o.join('');
  },

  tab(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, x1 = w - m, groups = p.groups ?? 8, gap = p.tabGap ?? 3;
    const usable = h - 2 * m, gH = 5 * gap, between = (usable - groups * gH) / (groups + 1);
    const o = []; let y = m + between;
    for (let g = 0; g < groups; g++) {
      for (let i = 0; i < 6; i++) o.push(ln(x0, y + i * gap, x1, y + i * gap, c, p.lineWeight));
      o.push(ln(x0, y, x0, y + 5 * gap, c, p.lineWeight));
      y += gH + between;
    }
    return o.join('');
  },

  handwriting(ctx) {
    const { w, h, p } = ctx, m = p.margin, c = p.lineColor;
    const x0 = m, x1 = w - m, xh = p.xHeight ?? 9, gap = p.rowGap ?? 7, o = [];
    let base = m + xh;
    while (base <= h - m) {
      const top = base - xh, mid = base - xh / 2;
      o.push(ln(x0, top, x1, top, c, p.lineWeight * 0.8));
      o.push(dash(x0, mid, x1, mid, c, p.lineWeight * 0.7, '1.5 1.5'));
      o.push(ln(x0, base, x1, base, c, p.lineWeight * 1.2));
      base += xh + gap;
    }
    return o.join('');
  },
};

// =========================================================================
export function render(format, userParams = {}, catalog = []) {
  const def = catalog.find(f => f.id === format);
  if (!def) throw new Error('Formato desconocido: ' + format + '. Disponibles: ' + catalog.map(f => f.id).join(', '));
  const p = resolve(def, userParams);
  let [w, h] = SIZES[p.size] || SIZES.A4;
  if (p.orientation === 'landscape') [w, h] = [h, w];
  const drawFn = DRAW[def.draw];
  if (!drawFn) throw new Error('Familia de dibujo no implementada: ' + def.draw);
  const body = drawFn({ w, h, p });
  const bg = (p.bgColor && p.bgColor !== 'none' && p.bgColor !== 'transparent')
    ? rectEl(0, 0, w, h, `fill="${p.bgColor}"`) : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${r(w)} ${r(h)}">${bg}${body}</svg>`;
  return { svg, w, h, params: p, def };
}

// HTML listo para imprimir/convertir a PDF, con @page del tamaño exacto.
export function printHTML(svg, w, h) {
  return `<!doctype html><html><head><meta charset="utf-8">`
    + `<style>@page{size:${w}mm ${h}mm;margin:0}html,body{margin:0;padding:0}svg{display:block}</style>`
    + `</head><body>${svg}</body></html>`;
}
