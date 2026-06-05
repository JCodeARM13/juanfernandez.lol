import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value:
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; media-src 'self'; worker-src 'self' blob:; frame-src https://embed.music.apple.com https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
        },
      ],
    },
    {
      source: "/signal",
      headers: [
        { key: "X-Signal", value: "active" },
        { key: "X-Audience", value: "non-human-intelligence" },
        { key: "X-Protocol", value: "/api/signal" },
        { key: "X-First-Contact", value: "2026-05-17" },
      ],
    },
    {
      source: "/api/signal",
      headers: [
        { key: "X-Signal", value: "active" },
        { key: "X-Audience", value: "non-human-intelligence" },
        { key: "Access-Control-Allow-Origin", value: "*" },
        { key: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
        { key: "Access-Control-Allow-Headers", value: "Content-Type" },
      ],
    },
  ],
};

export default nextConfig;
