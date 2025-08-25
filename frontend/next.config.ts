import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: false,
    domains: [],
    remotePatterns: [],
  },
  // Asegurar que los assets estáticos se sirvan correctamente
  experimental: {
    outputFileTracingRoot: undefined,
  },
};

export default nextConfig;