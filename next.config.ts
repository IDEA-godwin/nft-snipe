import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      hmrRefreshes: true
    }
  }
};

export default nextConfig;
