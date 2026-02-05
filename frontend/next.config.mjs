/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore Linting Errors during Build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Ignore TypeScript/Type Errors during Build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;