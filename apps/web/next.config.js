/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/services", "@repo/features"],
  output: 'export', // Enable static exports for PWA
  images: {
    unoptimized: true, // Required for static exports
  },
};

export default nextConfig;
