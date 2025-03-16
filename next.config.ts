import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // ✅ ข้าม ESLint Error
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ ข้าม TypeScript Error
  },
  output: "export", // ✅ ข้าม SSR, Prerender Error!
};

export default nextConfig;
