import type { NextConfig } from "next";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const megaBrowserEntry = require.resolve("megajs/dist/main.browser-es.mjs");

const isGhPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGhPages ? basePath : "",
  assetPrefix: isGhPages && basePath ? `${basePath}/` : undefined,
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    resolveAlias: {
      megajs: megaBrowserEntry,
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        megajs: megaBrowserEntry,
      };
    }
    return config;
  },
};

export default nextConfig;
