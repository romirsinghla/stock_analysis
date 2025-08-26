import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Stock Predictor - Real-Time Market Data",
  description: "Professional stock tracking and analysis powered by Alpaca Markets API. Real-time quotes, interactive charts, and comprehensive market data.",
  keywords: "stocks, trading, market data, alpaca, charts, finance, investment",
  authors: [{ name: "Stock Predictor" }],
  openGraph: {
    title: "Stock Predictor - Real-Time Market Data",
    description: "Professional stock tracking and analysis powered by Alpaca Markets API",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stock Predictor - Real-Time Market Data",
    description: "Professional stock tracking and analysis powered by Alpaca Markets API",
  },
};

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#0f1419',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
