import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  
  distDir: 'dist',
  productionBrowserSourceMaps: false,
  images: { unoptimized: true },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
