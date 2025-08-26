import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    ALPACA_API_KEY: process.env.ALPACA_API_KEY,
    ALPACA_API_SECRET: process.env.ALPACA_API_SECRET,
  },
};

export default nextConfig;
