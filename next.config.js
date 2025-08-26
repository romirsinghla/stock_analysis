/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
    FINNHUB_API_KEY: process.env.FINNHUB_API_KEY,
    REDIS_URL: process.env.REDIS_URL,
    ALPACA_API_KEY: process.env.ALPACA_API_KEY,
    ALPACA_API_SECRET: process.env.ALPACA_API_SECRET,
  },
}

module.exports = nextConfig