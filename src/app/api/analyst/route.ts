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

    const cacheKey = `analyst:${symbol.toUpperCase()}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    const [recommendations, priceTarget] = await Promise.all([
      finnhub.getAnalystRecommendations(symbol.toUpperCase()),
      finnhub.getPriceTarget(symbol.toUpperCase())
    ])

    const analystData = {
      recommendations,
      priceTarget
    }

    await cache.set(cacheKey, analystData, 3600)

    return NextResponse.json(analystData)
  } catch (error) {
    console.error('Analyst API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}