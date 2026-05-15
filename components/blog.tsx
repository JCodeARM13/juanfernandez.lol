"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GENERATED_POSTS } from "@/lib/generated-posts";

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const Blog: React.FC = () => {
  const posts = GENERATED_POSTS.slice(0, 4);
  const hasPosts = posts.length > 0;

  return (
    <section
      id="blog"
      className="relative w-full overflow-hidden"
      style={{ background: "var(--bg)", color: "var(--fg)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-40"
        style={{
          background:
            "radial-gradient(45% 60% at 75% 35%, color-mix(in oklab, var(--circle) 30%, transparent) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative max-w-6xl mx-auto px-6 md:px-10 py-28 md:py-36 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-120px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 mb-10 md:mb-14"
        >
          <span
            className="block w-2 h-2 rounded-full"
            style={{ background: "var(--circle, #1f5fa4)" }}
          />
          <p
            className="text-[10px] md:text-xs uppercase tracking-[0.4em]"
            style={{ color: "var(--muted)" }}
          >
            Blog
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start"
        >
          <div className="md:col-span-5">
            <h2
              className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight font-normal italic"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {hasPosts ? "Notas de campo." : "Notas de campo, pronto."}
            </h2>
            <p
              className="mt-6 max-w-md text-base md:text-lg leading-relaxed"
              style={{ color: "var(--fg)", opacity: 0.7 }}
            >
              Apuntes sobre música, operaciones, mobility, producto y la pelea
              diaria entre métricas y personas.
            </p>
            {hasPosts && (
              <Link
                href="/blog"
                className="inline-block mt-8 text-xs md:text-sm font-mono uppercase tracking-[0.2em] underline-offset-4 hover:underline"
                style={{ color: "var(--circle, #1f5fa4)" }}
              >
                Ver todas las entradas →
              </Link>
            )}
          </div>

          <div className="md:col-span-7">
            {hasPosts ? (
              <ul className="flex flex-col gap-4">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="block rounded-2xl px-6 py-6 md:px-7 md:py-7 transition-all hover:-translate-y-0.5"
                      style={{
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <p
                          className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em]"
                          style={{ color: "var(--muted)" }}
                        >
                          {formatDate(post.date)}
                        </p>
                        {post.author && (
                          <>
                            <span
                              className="text-[10px]"
                              style={{ color: "var(--muted)", opacity: 0.5 }}
                            >
                              ·
                            </span>
                            <p
                              className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em]"
                              style={{ color: "var(--muted)" }}
                            >
                              {post.author}
                            </p>
                          </>
                        )}
                      </div>
                      <h3
                        className="text-2xl md:text-[28px] leading-tight italic font-normal"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                      >
                        {post.title}
                      </h3>
                      {post.description && (
                        <p
                          className="mt-3 text-sm md:text-base leading-relaxed"
                          style={{ opacity: 0.72 }}
                        >
                          {post.description}
                        </p>
                      )}
                      <span
                        className="inline-block mt-4 text-xs font-mono uppercase tracking-[0.2em]"
                        style={{ color: "var(--circle, #1f5fa4)" }}
                      >
                        Leer →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="glass-card rounded-2xl px-6 py-8 md:px-8 md:py-10 flex flex-col gap-4">
                <p
                  className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em]"
                  style={{ color: "var(--muted)" }}
                >
                  Sin entradas todavía
                </p>
                <p className="text-sm md:text-base leading-relaxed">
                  Cuando publique algo, va a vivir aquí.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
