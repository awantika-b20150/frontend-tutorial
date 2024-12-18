import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
    {
      protocol: 'https',
      hostname: 'openweathermap.org',
      pathname: '/img/wn/**',
    }
  ],
  },
};

export default nextConfig;
