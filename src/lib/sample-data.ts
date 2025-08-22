import type { Quote, ChartData, Company, SearchResult, AnalystRecommendation, PriceTarget, OutlookPrediction } from '@/types'

export const sampleQuotes: { [key: string]: Quote } = {
  'AAPL': {
    symbol: 'AAPL',
    price: 227.52,
    change: 3.45,
    changePercent: 1.54,
    high: 229.87,
    low: 225.12,
    open: 226.00,
    previousClose: 224.07,
    volume: 47234567,
    marketCap: 3500000,
    timestamp: Date.now()
  },
  'GOOGL': {
    symbol: 'GOOGL',
    price: 182.34,
    change: -2.18,
    changePercent: -1.18,
    high: 185.67,
    low: 181.45,
    open: 184.20,
    previousClose: 184.52,
    volume: 28956432,
    marketCap: 2200000,
    timestamp: Date.now()
  },
  'TSLA': {
    symbol: 'TSLA',
    price: 251.89,
    change: 12.67,
    changePercent: 5.30,
    high: 254.32,
    low: 238.90,
    open: 242.10,
    previousClose: 239.22,
    volume: 89567123,
    marketCap: 800000,
    timestamp: Date.now()
  },
  'MSFT': {
    symbol: 'MSFT',
    price: 434.56,
    change: 5.67,
    changePercent: 1.32,
    high: 436.78,
    low: 432.10,
    open: 433.45,
    previousClose: 428.89,
    volume: 23456789,
    marketCap: 3200000,
    timestamp: Date.now()
  },
  'NVDA': {
    symbol: 'NVDA',
    price: 875.43,
    change: -15.67,
    changePercent: -1.76,
    high: 892.10,
    low: 871.25,
    open: 888.90,
    previousClose: 891.10,
    volume: 45678901,
    marketCap: 2100000,
    timestamp: Date.now()
  }
}

export const sampleCompanies: { [key: string]: Company } = {
  'AAPL': {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    employees: 164000,
    marketCap: 3500000,
    website: 'https://www.apple.com',
    logo: 'https://logo.clearbit.com/apple.com'
  },
  'GOOGL': {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    description: 'Alphabet Inc. provides online advertising services in the United States, Europe, the Middle East, Africa, the Asia-Pacific, Canada, and Latin America.',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    employees: 190000,
    marketCap: 2200000,
    website: 'https://abc.xyz',
    logo: 'https://logo.clearbit.com/google.com'
  },
  'TSLA': {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, and energy generation and storage systems.',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    employees: 140000,
    marketCap: 800000,
    website: 'https://www.tesla.com',
    logo: 'https://logo.clearbit.com/tesla.com'
  },
  'MSFT': {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide.',
    sector: 'Technology',
    industry: 'Software',
    employees: 221000,
    marketCap: 3200000,
    website: 'https://www.microsoft.com',
    logo: 'https://logo.clearbit.com/microsoft.com'
  },
  'NVDA': {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    description: 'NVIDIA Corporation operates as a visual computing company worldwide.',
    sector: 'Technology',
    industry: 'Semiconductors',
    employees: 29600,
    marketCap: 2100000,
    website: 'https://www.nvidia.com',
    logo: 'https://logo.clearbit.com/nvidia.com'
  }
}

export const sampleSearchResults: SearchResult[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'Equity',
    region: 'US',
    marketOpen: '09:30',
    marketClose: '16:00',
    timezone: 'US/Eastern',
    currency: 'USD',
    matchScore: 1.0
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc. Class A',
    type: 'Equity',
    region: 'US',
    marketOpen: '09:30',
    marketClose: '16:00',
    timezone: 'US/Eastern',
    currency: 'USD',
    matchScore: 0.95
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'Equity',
    region: 'US',
    marketOpen: '09:30',
    marketClose: '16:00',
    timezone: 'US/Eastern',
    currency: 'USD',
    matchScore: 0.92
  }
]

export function generateChartData(symbol: string, timeframe: string): ChartData[] {
  const basePrice = sampleQuotes[symbol]?.price || 100
  const days = timeframe === '1D' ? 1 : timeframe === '5D' ? 5 : timeframe === '1M' ? 30 : 
               timeframe === '6M' ? 180 : timeframe === '1Y' ? 365 : 1825
  
  const data: ChartData[] = []
  const now = Date.now()
  const interval = timeframe === '1D' ? 15 * 60 * 1000 : 24 * 60 * 60 * 1000 // 15min or 1day
  
  for (let i = days - 1; i >= 0; i--) {
    const timestamp = now - (i * interval)
    const variation = (Math.random() - 0.5) * 0.1 // ±5% variation
    const price = basePrice * (1 + variation)
    
    data.push({
      timestamp,
      open: price * (1 + (Math.random() - 0.5) * 0.02),
      high: price * (1 + Math.random() * 0.03),
      low: price * (1 - Math.random() * 0.03),
      close: price,
      volume: Math.floor(Math.random() * 10000000) + 1000000
    })
  }
  
  return data
}

export const sampleAnalyst: { [key: string]: { recommendations: AnalystRecommendation, priceTarget: PriceTarget } } = {
  'AAPL': {
    recommendations: {
      symbol: 'AAPL',
      buy: 18,
      hold: 8,
      sell: 2,
      strongBuy: 12,
      strongSell: 0,
      period: '2024-01'
    },
    priceTarget: {
      symbol: 'AAPL',
      targetHigh: 250.00,
      targetLow: 200.00,
      targetMean: 235.50,
      targetMedian: 238.00,
      numberOfAnalysts: 28,
      currency: 'USD'
    }
  },
  'GOOGL': {
    recommendations: {
      symbol: 'GOOGL',
      buy: 15,
      hold: 10,
      sell: 3,
      strongBuy: 8,
      strongSell: 1,
      period: '2024-01'
    },
    priceTarget: {
      symbol: 'GOOGL',
      targetHigh: 200.00,
      targetLow: 160.00,
      targetMean: 185.75,
      targetMedian: 188.00,
      numberOfAnalysts: 25,
      currency: 'USD'
    }
  },
  'TSLA': {
    recommendations: {
      symbol: 'TSLA',
      buy: 12,
      hold: 15,
      sell: 8,
      strongBuy: 5,
      strongSell: 3,
      period: '2024-01'
    },
    priceTarget: {
      symbol: 'TSLA',
      targetHigh: 300.00,
      targetLow: 180.00,
      targetMean: 240.50,
      targetMedian: 245.00,
      numberOfAnalysts: 22,
      currency: 'USD'
    }
  }
}