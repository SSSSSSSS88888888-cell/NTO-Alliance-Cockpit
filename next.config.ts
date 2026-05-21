import type { NextConfig } from "next";

// On GitHub Pages a project site is served from /<repo>, so the CI workflow
// passes that prefix via NEXT_PUBLIC_BASE_PATH. Locally it stays empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
