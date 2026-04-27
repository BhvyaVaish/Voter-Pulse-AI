import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
    // Dramatically reduce first-compile time by optimizing barrel imports
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      'recharts',
      'date-fns',
      'zod',
      '@hookform/resolvers',
    ],
  },
};

export default nextConfig;
