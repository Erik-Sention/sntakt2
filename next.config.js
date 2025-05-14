/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable trailing slashes for cleaner URLs
  trailingSlash: true,
  // Configure image domains for any external images
  images: {
    domains: [],
  },
  experimental: {
    esmExternals: false
  }
};

module.exports = nextConfig; 