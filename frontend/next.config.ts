import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },
};

export default nextConfig;