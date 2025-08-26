import { NextRequest, NextResponse } from 'next/server'
import { alpaca, yahooFinance, alphaVantage, finnhub } from '@/lib/api-clients'
import { cache } from '@/lib/redis'
import { sampleQuotes } from '@/lib/sample-data'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    const cacheKey = `quote:${symbol.toUpperCase()}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      console.log(`Cache hit for ${symbol}`)
      return NextResponse.json(cached)
    }

    // Try multiple sources: Alpaca first, then Alpha Vantage, then Yahoo Finance, then Finnhub
    let quote = null
    
    try {
      console.log(`Trying Alpaca for ${symbol}...`)
      quote = await alpaca.getQuote(symbol.toUpperCase())
    } catch (error) {
      console.error('Alpaca failed:', error)
    }
    
    if (!quote) {
      try {
        console.log(`Trying Alpha Vantage for ${symbol}...`)
        quote = await alphaVantage.getQuote(symbol.toUpperCase())
      } catch (error) {
        console.error('Alpha Vantage failed:', error)
      }
    }
    
    if (!quote) {
      try {
        console.log(`Trying Yahoo Finance for ${symbol}...`)
        quote = await yahooFinance.getQuote(symbol.toUpperCase())
      } catch (error) {
        console.error('Yahoo Finance failed:', error)
      }
    }
    
    if (!quote) {
      try {
        console.log(`Trying Finnhub for ${symbol}...`)
        quote = await finnhub.getQuote(symbol.toUpperCase())
      } catch (error) {
        console.error('Finnhub failed:', error)
      }
    }
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found from any source' },
        { status: 404 }
      )
    }

    // Cache for 30 seconds
    await cache.set(cacheKey, quote, 30)
    console.log(`Cached quote for ${symbol}`)

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}