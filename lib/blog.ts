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

const renderer = new marked.Renderer();
renderer.image = ({ href, title, text }) => {
  const safeAlt = (text ?? "").replace(/"/g, "&quot;");
  const safeTitle = title ? ` title="${title.replace(/"/g, "&quot;")}"` : "";
  const hrefStr = typeof href === "string" ? href.trim() : "";
  const isPlaceholder = !hrefStr || hrefStr.startsWith("PLACEHOLDER_");
  if (isPlaceholder) {
    const dataAttr = hrefStr ? ` data-placeholder="${hrefStr}"` : "";
    return `<figure class="post-image post-image-placeholder"${dataAttr}><div class="post-image-frame" role="img" aria-label="${safeAlt}"><span class="post-image-tag">Imagen pendiente</span><span class="post-image-alt">${safeAlt}</span></div><figcaption>${safeAlt}</figcaption></figure>`;
  }
  return `<figure class="post-image"><img src="${hrefStr}" alt="${safeAlt}"${safeTitle} loading="lazy" /><figcaption>${safeAlt}</figcaption></figure>`;
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
