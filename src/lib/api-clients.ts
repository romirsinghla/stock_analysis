import axios from 'axios'
import type { Quote, ChartData, Company, SearchResult, AnalystRecommendation, PriceTarget } from '@/types'

export class YahooFinanceClient {
  async getQuote(symbol: string): Promise<Quote | null> {
    try {
      // Try the alternate Yahoo Finance endpoint
      const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote`, {
        params: {
          symbols: symbol,
          fields: 'regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketDayHigh,regularMarketDayLow,regularMarketOpen,regularMarketPreviousClose,regularMarketVolume'
        },
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      })

      const result = response.data?.quoteResponse?.result?.[0]
      if (!result) return null

      return {
        symbol: result.symbol,
        price: result.regularMarketPrice || 0,
        change: result.regularMarketChange || 0,
        changePercent: result.regularMarketChangePercent || 0,
        high: result.regularMarketDayHigh || 0,
        low: result.regularMarketDayLow || 0,
        open: result.regularMarketOpen || 0,
        previousClose: result.regularMarketPreviousClose || 0,
        volume: result.regularMarketVolume || 0,
        marketCap: result.marketCap,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('Yahoo Finance quote error:', error)
      return null
    }
  }

  async searchSymbols(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get(`https://query1.finance.yahoo.com/v1/finance/search`, {
        params: {
          q: query,
          quotesCount: 10,
          newsCount: 0,
        },
        timeout: 10000
      })

      const quotes = response.data?.quotes || []
      return quotes.map((quote: any) => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || '',
        type: quote.typeDisp || 'Stock',
        region: quote.region || 'US',
        marketOpen: '9:30',
        marketClose: '16:00',
        timezone: 'EST',
        currency: 'USD',
        matchScore: 1.0,
      }))
    } catch (error) {
      console.error('Yahoo Finance search error:', error)
      return []
    }
  }
}

export class AlphaVantageClient {
  private apiKey: string
  private baseUrl = 'https://www.alphavantage.co/query'

  constructor() {
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || ''
  }

  async getQuote(symbol: string): Promise<Quote | null> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: this.apiKey,
        },
        timeout: 10000
      })

      const quote = response.data['Global Quote']
      if (!quote) {
        console.error('Alpha Vantage: No quote data received')
        return null
      }

      const price = parseFloat(quote['05. price']) || 0
      const change = parseFloat(quote['09. change']) || 0
      const changePercent = parseFloat(quote['10. change percent']?.replace('%', '')) || 0

      return {
        symbol: quote['01. symbol'],
        price,
        change,
        changePercent,
        high: parseFloat(quote['03. high']) || 0,
        low: parseFloat(quote['04. low']) || 0,
        open: parseFloat(quote['02. open']) || 0,
        previousClose: parseFloat(quote['08. previous close']) || 0,
        volume: parseInt(quote['06. volume']) || 0,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('Alpha Vantage quote error:', error)
      return null
    }
  }

  async getHistoricalData(symbol: string, timeframe: string = 'daily'): Promise<ChartData[]> {
    try {
      const functionMap: { [key: string]: string } = {
        '1D': 'TIME_SERIES_INTRADAY',
        '5D': 'TIME_SERIES_INTRADAY', 
        '1M': 'TIME_SERIES_DAILY',
        '6M': 'TIME_SERIES_DAILY',
        'YTD': 'TIME_SERIES_DAILY',
        '1Y': 'TIME_SERIES_DAILY',
        '5Y': 'TIME_SERIES_WEEKLY',
      }

      const func = functionMap[timeframe] || 'TIME_SERIES_DAILY'
      const params: any = {
        function: func,
        symbol,
        apikey: this.apiKey,
        outputsize: timeframe === '5Y' ? 'full' : 'compact',
      }

      if (func === 'TIME_SERIES_INTRADAY') {
        params.interval = timeframe === '1D' ? '15min' : '1hour'
      }

      const response = await axios.get(this.baseUrl, { params })
      
      const data = response.data
      let timeSeries: any = {}

      if (func === 'TIME_SERIES_INTRADAY') {
        timeSeries = data[`Time Series (${params.interval})`] || {}
      } else if (func === 'TIME_SERIES_DAILY') {
        timeSeries = data['Time Series (Daily)'] || {}
      } else if (func === 'TIME_SERIES_WEEKLY') {
        timeSeries = data['Weekly Time Series'] || {}
      }

      return Object.entries(timeSeries).map(([timestamp, values]: [string, any]) => ({
        timestamp: new Date(timestamp).getTime(),
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
      })).sort((a, b) => a.timestamp - b.timestamp)
    } catch (error) {
      console.error('Alpha Vantage API error:', error)
      return []
    }
  }

  async searchSymbols(query: string): Promise<SearchResult[]> {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: this.apiKey,
        },
      })

      const matches = response.data.bestMatches || []
      return matches.map((match: any) => ({
        symbol: match['1. symbol'],
        name: match['2. name'],
        type: match['3. type'],
        region: match['4. region'],
        marketOpen: match['5. marketOpen'],
        marketClose: match['6. marketClose'],
        timezone: match['7. timezone'],
        currency: match['8. currency'],
        matchScore: parseFloat(match['9. matchScore']),
      }))
    } catch (error) {
      console.error('Alpha Vantage search error:', error)
      return []
    }
  }
}

export class FinnhubClient {
  private apiKey: string
  private baseUrl = 'https://finnhub.io/api/v1'

  constructor() {
    this.apiKey = process.env.FINNHUB_API_KEY || ''
  }

  async getQuote(symbol: string): Promise<Quote | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/quote`, {
        params: {
          symbol,
          token: this.apiKey,
        },
      })

      const data = response.data
      return {
        symbol,
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        open: data.o,
        previousClose: data.pc,
        volume: 0,
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error('Finnhub quote error:', error)
      return null
    }
  }

  async getCompanyProfile(symbol: string): Promise<Company | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/stock/profile2`, {
        params: {
          symbol,
          token: this.apiKey,
        },
      })

      const data = response.data
      return {
        symbol,
        name: data.name,
        description: data.shareOutstanding ? `Market Cap: ${data.marketCapitalization}M` : '',
        sector: data.finnhubIndustry || '',
        industry: data.finnhubIndustry || '',
        employees: data.employeeTotal,
        marketCap: data.marketCapitalization,
        website: data.weburl,
        logo: data.logo,
      }
    } catch (error) {
      console.error('Finnhub company profile error:', error)
      return null
    }
  }

  async getAnalystRecommendations(symbol: string): Promise<AnalystRecommendation | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/stock/recommendation`, {
        params: {
          symbol,
          token: this.apiKey,
        },
      })

      const data = response.data
      if (!data || data.length === 0) return null

      const latest = data[0]
      return {
        symbol,
        buy: latest.buy,
        hold: latest.hold,
        sell: latest.sell,
        strongBuy: latest.strongBuy,
        strongSell: latest.strongSell,
        period: latest.period,
      }
    } catch (error) {
      console.error('Finnhub analyst recommendations error:', error)
      return null
    }
  }

  async getPriceTarget(symbol: string): Promise<PriceTarget | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/stock/price-target`, {
        params: {
          symbol,
          token: this.apiKey,
        },
      })

      const data = response.data
      return {
        symbol,
        targetHigh: data.targetHigh,
        targetLow: data.targetLow,
        targetMean: data.targetMean,
        targetMedian: data.targetMedian,
        numberOfAnalysts: data.numberOfAnalysts,
        currency: 'USD',
      }
    } catch (error) {
      console.error('Finnhub price target error:', error)
      return null
    }
  }
}

export class AlpacaClient {
  private apiKey: string
  private apiSecret: string
  private baseUrl = 'https://data.alpaca.markets/v2'

  constructor() {
    this.apiKey = process.env.ALPACA_API_KEY || ''
    this.apiSecret = process.env.ALPACA_API_SECRET || ''
  }

  private getTimeframeParam(timeframe: string): string {
    const timeframeMap: { [key: string]: string } = {
      '1D': '15Min',  // Use 15-minute bars for intraday view
      '5D': '1Hour',  // Use 1-hour bars for 5-day view
      '1W': '1Day',
      '1M': '1Day',
      '6M': '1Day',
      'YTD': '1Day',
      '1Y': '1Day',
      '5Y': '1Week',
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
        headers: {
          'APCA-API-KEY-ID': this.apiKey,
          'APCA-API-SECRET-KEY': this.apiSecret,
          'accept': 'application/json'
        },
        timeout: 10000
      })

      const bars = response.data?.bars?.[symbol.toUpperCase()] || []
      
      return bars.map((bar: any) => ({
        timestamp: new Date(bar.t).getTime(),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v
      })).sort((a: ChartData, b: ChartData) => a.timestamp - b.timestamp)
    } catch (error) {
      console.error('Alpaca API error:', error)
      return []
    }
  }

  async getQuote(symbol: string): Promise<Quote | null> {
    try {
      // Get the latest bar to use as current quote
      const bars = await this.getHistoricalData(symbol, '1D')
      if (bars.length === 0) return null

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
      return null
    }
  }

  async searchSymbols(query: string): Promise<SearchResult[]> {
    // Alpaca doesn't have a built-in symbol search endpoint
    // For now, we'll return basic results for common symbols
    const commonSymbols = [
      'AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'META', 'NFLX', 'NVDA', 
      'SPY', 'QQQ', 'IWM', 'AMD', 'INTC', 'CRM', 'ORCL', 'IBM'
    ]
    
    const matchingSymbols = commonSymbols.filter(symbol => 
      symbol.toLowerCase().includes(query.toLowerCase())
    )

    return matchingSymbols.map(symbol => ({
      symbol,
      name: `${symbol} Inc.`,
      type: 'Equity',
      region: 'US',
      marketOpen: '09:30',
      marketClose: '16:00',
      timezone: 'US/Eastern',
      currency: 'USD',
      matchScore: symbol.toLowerCase() === query.toLowerCase() ? 1.0 : 0.8
    }))
  }
}

export const yahooFinance = new YahooFinanceClient()
export const alphaVantage = new AlphaVantageClient()
export const finnhub = new FinnhubClient()
export const alpaca = new AlpacaClient()