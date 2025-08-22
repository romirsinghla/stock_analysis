import { NextRequest, NextResponse } from 'next/server'
import { finnhub } from '@/lib/api-clients'
import { cache } from '@/lib/redis'

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
      return NextResponse.json(cached)
    }

    const quote = await finnhub.getQuote(symbol.toUpperCase())
    
    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    await cache.set(cacheKey, quote, 30)

    return NextResponse.json(quote)
  } catch (error) {
    console.error('Quote API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}