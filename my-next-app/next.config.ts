import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost'], // Ajoutez localhost ici
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/file/**', // Ajustez selon le bon chemin
      },
    ],
  },
};

export default nextConfig;
