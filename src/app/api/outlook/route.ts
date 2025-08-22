import { NextRequest, NextResponse } from 'next/server'
import { finnhub } from '@/lib/api-clients'
import { cache } from '@/lib/redis'
import { outlookEngines } from '@/lib/outlook-engines'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const engine = searchParams.get('engine') || 'analyst'

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    if (!outlookEngines[engine as keyof typeof outlookEngines]) {
      return NextResponse.json(
        { error: 'Invalid engine parameter' },
        { status: 400 }
      )
    }

    const cacheKey = `outlook:${symbol.toUpperCase()}:${engine}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    const [quote, analystData] = await Promise.all([
      finnhub.getQuote(symbol.toUpperCase()),
      Promise.all([
        finnhub.getAnalystRecommendations(symbol.toUpperCase()),
        finnhub.getPriceTarget(symbol.toUpperCase())
      ])
    ])

    if (!quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      )
    }

    const [recommendations, priceTarget] = analystData
    const outlookEngine = outlookEngines[engine as keyof typeof outlookEngines]
    
    const outlook = await outlookEngine.generateOutlook(
      symbol.toUpperCase(),
      quote,
      recommendations || undefined,
      priceTarget || undefined
    )

    await cache.set(cacheKey, outlook, 1800)

    return NextResponse.json(outlook)
  } catch (error) {
    console.error('Outlook API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}