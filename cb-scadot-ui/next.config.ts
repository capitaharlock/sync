import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  
  distDir: 'dist',
  productionBrowserSourceMaps: false,
  images: { unoptimized: true },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
