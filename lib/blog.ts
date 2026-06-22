import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const POSTS_DIR = path.join(process.cwd(), "blog");

export type PostFrontmatter = {
  title: string;
  description?: string;
  date: string;
  author?: string;
  tags?: string[];
  cover?: string | null;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
};

export type Post = PostMeta & {
  html: string;
  raw: string;
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
// Permite http(s)/mailto/tel, rutas relativas, anclas y data:image.
// Bloquea javascript:, vbscript:, data:text/html, etc.
function safeUrl(u: string): string {
  const t = (u ?? "").trim();
  if (/^(https?:|mailto:|tel:)/i.test(t)) return t;
  if (/^(\/|\.\/|#)/.test(t)) return t;
  if (/^data:image\//i.test(t)) return t;
  return "";
}

const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  const safeAlt = escapeHtml(text ?? "");
  const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
  const hrefStr = typeof href === "string" ? href.trim() : "";
  const isPlaceholder = !hrefStr || hrefStr.startsWith("PLACEHOLDER_");
  if (isPlaceholder) {
    const dataAttr = hrefStr ? ` data-placeholder="${escapeHtml(hrefStr)}"` : "";
    return `<figure class="post-image post-image-placeholder"${dataAttr}><div class="post-image-frame" role="img" aria-label="${safeAlt}"><span class="post-image-tag">Imagen pendiente</span><span class="post-image-alt">${safeAlt}</span></div><figcaption>${safeAlt}</figcaption></figure>`;
  }
  const src = safeUrl(hrefStr);
  if (!src) return `<figure class="post-image"><figcaption>${safeAlt}</figcaption></figure>`;
  return `<figure class="post-image"><img src="${escapeHtml(src)}" alt="${safeAlt}"${safeTitle} loading="lazy" /><figcaption>${safeAlt}</figcaption></figure>`;
};
// Links del markdown: bloquea esquemas peligrosos y endurece externos.
// (No afecta iframes embebidos como HTML crudo —p.ej. Apple Music—.)
renderer.link = ({ href, title, text }) => {
  const url = safeUrl(typeof href === "string" ? href : "");
  if (!url) return text;
  const t = title ? ` title="${escapeHtml(title)}"` : "";
  const rel = /^https?:/i.test(url) ? ` target="_blank" rel="noopener noreferrer"` : "";
  return `<a href="${escapeHtml(url)}"${t}${rel}>${text}</a>`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
});

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => file.replace(/\.md$/, ""));
}

function readPostFile(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  let parsed: { data: Record<string, unknown>; content: string };
  try {
    parsed = matter(raw);
  } catch {
    return null;
  }
  const fm = parsed.data as Partial<PostFrontmatter>;
  if (!fm.title || !fm.date) return null;
  const html = marked.parse(parsed.content, { async: false }) as string;
  return {
    slug,
    title: fm.title,
    description: fm.description,
    date:
      typeof fm.date === "string"
        ? fm.date
        : new Date(fm.date as unknown as string).toISOString().slice(0, 10),
    author: fm.author,
    tags: fm.tags ?? [],
    cover: fm.cover ?? null,
    html,
    raw: parsed.content,
  };
}

export function getPostBySlug(slug: string): Post | null {
  return readPostFile(slug);
}

export function getAllPosts(): PostMeta[] {
  return getPostSlugs()
    .map((slug) => readPostFile(slug))
    .filter((p): p is Post => p !== null)
    .map(({ html: _h, raw: _r, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
