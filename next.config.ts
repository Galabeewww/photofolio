import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Mendaftarkan Cloudinary agar Next.js diizinkan mengoptimasi gambar secara eksternal
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
