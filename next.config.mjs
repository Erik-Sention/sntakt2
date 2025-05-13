/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable trailing slashes for cleaner URLs
  trailingSlash: true,
  // Configure image domains for any external images
  images: {
    domains: [],
  },
};

export default nextConfig; 