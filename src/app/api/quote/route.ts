import { NextRequest, NextResponse } from 'next/server'
import { yahooFinance, alphaVantage, finnhub } from '@/lib/api-clients'
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

    // DEMO MODE: Use sample data (skip cache for speed)
    const quote = sampleQuotes[symbol.toUpperCase()]
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    // Add demo indicator and update timestamp
    const demoQuote = {
      ...quote,
      isDemoData: true,
      timestamp: Date.now()
    }

    return NextResponse.json(demoQuote)
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}