import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'standalone',
  
  distDir: 'dist',
  productionBrowserSourceMaps: false,
  images: { unoptimized: true },
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/projects',
  //       permanent: false,
  //     },
  //   ];
  // },
};

export default nextConfig;
