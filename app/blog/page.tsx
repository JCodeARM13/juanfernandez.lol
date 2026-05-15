import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, formatPostDate } from "@/lib/blog";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog · Juan Fernández",
  description:
    "Notas de campo: música, operaciones, mobility, producto. Apuntes honestos sobre lo que pienso y escucho.",
  alternates: { canonical: "https://juanfernandez.lol/blog" },
  openGraph: {
    title: "Blog · Juan Fernández",
    description:
      "Notas de campo: música, operaciones, mobility, producto. Apuntes honestos sobre lo que pienso y escucho.",
    url: "https://juanfernandez.lol/blog",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="blog-shell">
      <header className="blog-header">
        <Link href="/" className="blog-back">
          ← Volver al inicio
        </Link>
        <p className="blog-eyebrow">Blog</p>
        <h1 className="blog-title">Notas de campo.</h1>
        <p className="blog-subtitle">
          Música, operaciones, mobility y la pelea diaria entre métricas y
          personas. Sin filtros, sin agenda.
        </p>
      </header>

      <section className="blog-list">
        {posts.length === 0 && (
          <p className="blog-empty">Sin entradas todavía.</p>
        )}
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-card">
            <p className="blog-card-date">{formatPostDate(post.date)}</p>
            <h2 className="blog-card-title">{post.title}</h2>
            {post.description && (
              <p className="blog-card-desc">{post.description}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <ul className="blog-card-tags">
                {post.tags.map((t) => (
                  <li key={t}>#{t}</li>
                ))}
              </ul>
            )}
            <span className="blog-card-cta">Leer →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
