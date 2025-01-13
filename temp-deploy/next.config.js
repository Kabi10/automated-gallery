/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimized for Node.js hosting
  images: {
    domains: [
      'picsum.photos', // For development
      process.env.NEXT_PUBLIC_IMAGE_DOMAIN, // Production domain
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig 