import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Disable ESLint as we're using Biome
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
