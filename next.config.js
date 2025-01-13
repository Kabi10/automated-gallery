/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['t.me'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 