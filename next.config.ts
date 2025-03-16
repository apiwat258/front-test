import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "export", // ✅ สำคัญมาก
  experimental: {
    appDir: true, // ยืนยันว่าใช้ App Router
  },
};

export default nextConfig;
