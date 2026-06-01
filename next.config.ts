import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
};

export default nextConfig;
