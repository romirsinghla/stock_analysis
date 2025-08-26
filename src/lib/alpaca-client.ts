import axios from 'axios'
import type { Quote, ChartData, Company, SearchResult } from '@/types'

export class AlpacaClient {
  private apiKey: string
  private apiSecret: string
  private baseUrl = 'https://data.alpaca.markets/v2'

  constructor() {
    this.apiKey = process.env.ALPACA_API_KEY || ''
    this.apiSecret = process.env.ALPACA_API_SECRET || ''
  }

  private getHeaders() {
    return {
      'APCA-API-KEY-ID': this.apiKey,
      'APCA-API-SECRET-KEY': this.apiSecret,
      'accept': 'application/json'
    }
  }

  private getTimeframeParam(timeframe: string): string {
    const timeframeMap: { [key: string]: string } = {
      '1D': '15Min',  // Use 15-minute bars for intraday view
      '5D': '1Hour',  // Use 1-hour bars for 5-day view
      '1W': '1Day',   // Daily bars for week view
      '1M': '1Day',   // Daily bars for month view
      '6M': '1Day',   // Daily bars for 6-month view
      'YTD': '1Day',  // Daily bars for year-to-date
      '1Y': '1Day',   // Daily bars for 1-year view
      '5Y': '1Week',  // Weekly bars for 5-year view
    }
    return timeframeMap[timeframe] || '1Day'
  }

  private getDateRange(timeframe: string): { start: string, end: string } {
    const now = new Date()
    const end = now.toISOString().split('T')[0]
    let start: Date

    switch (timeframe) {
      case '1D':
        start = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
        break
      case '5D':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days to account for weekends
        break
      case '1W':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '1M':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '6M':
        start = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000)
        break
      case 'YTD':
        start = new Date(now.getFullYear(), 0, 1)
        break
      case '1Y':
        start = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      case '5Y':
        start = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000)
        break
      default:
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    return {
      start: start.toISOString().split('T')[0],
      end
    }
  }

  async getHistoricalData(symbol: string, timeframe: string = '1D'): Promise<ChartData[]> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Alpaca API credentials not configured')
      }

      const { start, end } = this.getDateRange(timeframe)
      const alpacaTimeframe = this.getTimeframeParam(timeframe)
      
      const response = await axios.get(`${this.baseUrl}/stocks/bars`, {
        params: {
          symbols: symbol.toUpperCase(),
          timeframe: alpacaTimeframe,
          start,
          end,
          limit: 1000,
          adjustment: 'split',
          feed: 'iex'
        },
        headers: this.getHeaders(),
        timeout: 15000
      })

      const bars = response.data?.bars?.[symbol.toUpperCase()] || []
      
      if (!bars.length) {
        throw new Error(`No data available for ${symbol}`)
      }
      
      return bars.map((bar: { t: string; o: number; h: number; l: number; c: number; v: number }) => ({
        timestamp: new Date(bar.t).getTime(),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v
      })).sort((a: ChartData, b: ChartData) => a.timestamp - b.timestamp)
    } catch (error) {
      console.error('Alpaca historical data error:', error)
      throw error
    }
  }

  async getQuote(symbol: string): Promise<Quote> {
    try {
      if (!this.apiKey || !this.apiSecret) {
        throw new Error('Alpaca API credentials not configured')
      }

      // Get the latest day's data for the quote
      const bars = await this.getHistoricalData(symbol, '1D')
      if (bars.length === 0) {
        throw new Error(`No quote data available for ${symbol}`)
      }

      const latestBar = bars[bars.length - 1]
      const previousBar = bars.length > 1 ? bars[bars.length - 2] : latestBar
      
      const change = latestBar.close - previousBar.close
      const changePercent = previousBar.close > 0 ? (change / previousBar.close) * 100 : 0

      return {
        symbol: symbol.toUpperCase(),
        price: latestBar.close,
        change,
        changePercent,
        high: latestBar.high,
        low: latestBar.low,
        open: latestBar.open,
        previousClose: previousBar.close,
        volume: latestBar.volume,
        timestamp: latestBar.timestamp
      }
    } catch (error) {
      console.error('Alpaca quote error:', error)
      throw error
    }
  }

  async getCompanyProfile(symbol: string): Promise<Company> {
    // Alpaca doesn't provide company profile data
    // Return basic information with the symbol
    return {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Inc.`,
      description: `Company information for ${symbol.toUpperCase()}`,
      sector: 'Technology',
      industry: 'Software',
    }
  }

  async searchSymbols(query: string): Promise<SearchResult[]> {
    // Enhanced symbol search with more comprehensive stock list
    const stockList = [
      // Major Tech
      { symbol: 'AAPL', name: 'Apple Inc.' },
      { symbol: 'GOOGL', name: 'Alphabet Inc. Class A' },
      { symbol: 'GOOG', name: 'Alphabet Inc. Class C' },
      { symbol: 'MSFT', name: 'Microsoft Corporation' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.' },
      { symbol: 'META', name: 'Meta Platforms Inc.' },
      { symbol: 'TSLA', name: 'Tesla Inc.' },
      { symbol: 'NFLX', name: 'Netflix Inc.' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation' },
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc.' },
      { symbol: 'INTC', name: 'Intel Corporation' },
      { symbol: 'CRM', name: 'Salesforce Inc.' },
      { symbol: 'ORCL', name: 'Oracle Corporation' },
      { symbol: 'IBM', name: 'International Business Machines' },
      
      // Financial
      { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
      { symbol: 'BAC', name: 'Bank of America Corporation' },
      { symbol: 'WFC', name: 'Wells Fargo & Company' },
      { symbol: 'GS', name: 'Goldman Sachs Group Inc.' },
      { symbol: 'MS', name: 'Morgan Stanley' },
      
      // Healthcare
      { symbol: 'JNJ', name: 'Johnson & Johnson' },
      { symbol: 'PFE', name: 'Pfizer Inc.' },
      { symbol: 'MRNA', name: 'Moderna Inc.' },
      { symbol: 'UNH', name: 'UnitedHealth Group Inc.' },
      
      // Consumer
      { symbol: 'WMT', name: 'Walmart Inc.' },
      { symbol: 'KO', name: 'Coca-Cola Company' },
      { symbol: 'PEP', name: 'PepsiCo Inc.' },
      { symbol: 'NKE', name: 'Nike Inc.' },
      
      // ETFs
      { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust' },
      { symbol: 'QQQ', name: 'Invesco QQQ Trust' },
      { symbol: 'IWM', name: 'iShares Russell 2000 ETF' },
      { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF' },
      { symbol: 'VOO', name: 'Vanguard S&P 500 ETF' }
    ]
    
    const searchTerm = query.toLowerCase()
    const matchingSymbols = stockList.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm) ||
      stock.name.toLowerCase().includes(searchTerm)
    )

    return matchingSymbols.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      type: 'Equity',
      region: 'US',
      marketOpen: '09:30',
      marketClose: '16:00',
      timezone: 'US/Eastern',
      currency: 'USD',
      matchScore: stock.symbol.toLowerCase() === searchTerm ? 1.0 : 0.8
    })).slice(0, 10) // Limit to 10 results
  }
}

export const alpacaClient = new AlpacaClient()