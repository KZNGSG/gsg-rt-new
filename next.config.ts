import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gsg-rt.ru',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
