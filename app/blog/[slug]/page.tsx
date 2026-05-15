import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, formatPostDate } from "@/lib/blog";
import "../blog.css";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const url = `https://juanfernandez.lol/blog/${post.slug}`;
  return {
    title: `${post.title} · Juan Fernández`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<Params> }
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Markdown content is authored by the site owner from local files in /blog,
  // not from user input. Iframes (Apple Music embeds) are intentional.
  const __html = post.html;

  return (
    <main className="blog-shell post-shell">
      <header className="post-header">
        <Link href="/blog" className="blog-back">
          ← Todas las entradas
        </Link>
        <p className="post-meta">
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
          {post.author && <span> · {post.author}</span>}
        </p>
      </header>

      <article
        className="post-body"
        dangerouslySetInnerHTML={{ __html }}
      />

      <footer className="post-footer">
        <Link href="/blog" className="blog-back">
          ← Todas las entradas
        </Link>
      </footer>
    </main>
  );
}
