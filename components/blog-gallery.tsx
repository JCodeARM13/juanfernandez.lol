"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type BlogGalleryPost = {
  slug: string;
  title: string;
  date: string;
  cover?: string | null;
  author?: string | null;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Degradado de respaldo cuando un post todavía no tiene portada generada.
const FALLBACK_GRADIENT =
  "linear-gradient(135deg, color-mix(in oklab, var(--circle, #1f5fa4) 40%, #0a0a0a) 0%, #0a0a0a 100%)";

const Cover: React.FC<{ post: BlogGalleryPost }> = ({ post }) => {
  if (!post.cover) {
    return (
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full"
        style={{ background: FALLBACK_GRADIENT }}
      />
    );
  }
  return (
    <img
      src={post.cover}
      alt={post.title}
      loading="lazy"
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
};

const CardMeta: React.FC<{ post: BlogGalleryPost; size?: "sm" | "lg" }> = ({
  post,
  size = "lg",
}) => (
  <>
    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
      {formatDate(post.date)}
    </p>
    <h3
      className={cn(
        "italic leading-tight text-white",
        size === "lg" ? "text-2xl md:text-3xl" : "text-xl",
      )}
      style={{ fontFamily: "'Instrument Serif', serif" }}
    >
      {post.title}
    </h3>
    <span className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-white/80">
      Leer →
    </span>
  </>
);

// Desktop: acordeón horizontal hover-expand (adaptado de Skiper52 HoverExpand,
// pero con flex-grow para que nunca desborde el contenedor sin importar cuántos
// posts haya).
const HoverExpandRow: React.FC<{
  posts: BlogGalleryPost[];
  className?: string;
}> = ({ posts, className }) => {
  const [active, setActive] = useState(0);

  return (
    <div className={cn("w-full items-stretch justify-center gap-2", className)}>
      {posts.map((post, index) => {
        const isActive = active === index;
        return (
          <motion.div
            key={post.slug}
            className="relative cursor-pointer overflow-hidden rounded-3xl"
            style={{ flexBasis: 0, height: "26rem", minWidth: "3rem" }}
            initial={false}
            animate={{ flexGrow: isActive ? 8 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onHoverStart={() => setActive(index)}
            onFocusCapture={() => setActive(index)}
          >
            <Link
              href={`/blog/${post.slug}`}
              aria-label={post.title}
              className="block h-full w-full"
            >
              <Cover post={post} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 }}
                    className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-6"
                  >
                    <CardMeta post={post} size="lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};

// Móvil: carrusel horizontal con scroll-snap (el acordeón no funciona en
// pantallas chicas porque las columnas colapsadas quedan inservibles).
const SnapRow: React.FC<{ posts: BlogGalleryPost[]; className?: string }> = ({
  posts,
  className,
}) => (
  <div
    className={cn(
      "flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
      className,
    )}
  >
    {posts.map((post) => (
      <Link
        key={post.slug}
        href={`/blog/${post.slug}`}
        aria-label={post.title}
        className="relative aspect-[4/5] w-[78vw] flex-none snap-center overflow-hidden rounded-3xl"
      >
        <Cover post={post} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5">
          <CardMeta post={post} size="sm" />
        </div>
      </Link>
    ))}
  </div>
);

export const BlogGallery: React.FC<{
  posts: BlogGalleryPost[];
  className?: string;
}> = ({ posts, className }) => {
  if (!posts.length) return null;
  return (
    <div className={cn("w-full", className)}>
      <HoverExpandRow posts={posts} className="hidden md:flex" />
      <SnapRow posts={posts} className="md:hidden" />
    </div>
  );
};

export default BlogGallery;
