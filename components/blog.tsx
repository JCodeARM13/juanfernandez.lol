"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GENERATED_POSTS } from "@/lib/generated-posts";
import { BlogGallery } from "@/components/blog-gallery";

export const Blog: React.FC = () => {
  const posts = GENERATED_POSTS;
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
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl">
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
          </div>
          {hasPosts && (
            <Link
              href="/blog"
              className="shrink-0 text-xs md:text-sm font-mono uppercase tracking-[0.2em] underline-offset-4 hover:underline"
              style={{ color: "var(--circle, #1f5fa4)" }}
            >
              Ver todas las entradas →
            </Link>
          )}
        </motion.div>

        {hasPosts ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 md:mt-16"
          >
            <BlogGallery posts={posts} />
          </motion.div>
        ) : (
          <div className="mt-12 glass-card rounded-2xl px-6 py-8 md:px-8 md:py-10 flex flex-col gap-4">
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
    </section>
  );
};

export default Blog;
