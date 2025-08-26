export interface Quote {
  symbol: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  open: number
  previousClose: number
  volume: number
  marketCap?: number
  timestamp: number
}

export interface ChartData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface Company {
  symbol: string
  name: string
  description: string
  sector: string
  industry: string
  employees?: number
  marketCap?: number
  website?: string
  logo?: string
}

export interface SearchResult {
  symbol: string
  name: string
  type: string
  region: string
  marketOpen: string
  marketClose: string
  timezone: string
  currency: string
  matchScore: number
}

export interface AnalystRecommendation {
  symbol: string
  buy: number
  hold: number
  sell: number
  strongBuy: number
  strongSell: number
  period: string
}

export interface PriceTarget {
  symbol: string
  targetHigh: number
  targetLow: number
  targetMean: number
  targetMedian: number
  numberOfAnalysts: number
  currency: string
}

export interface OutlookPrediction {
  symbol: string
  summary: string
  confidence: number
  rationale: string[]
  timeframe: string
  version: string
  engine: string
}

export type TimeFrame = '1D' | '5D' | '1W' | '1M' | '6M' | 'YTD' | '1Y' | '5Y'

export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}