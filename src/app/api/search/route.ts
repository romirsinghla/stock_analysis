import { NextRequest, NextResponse } from 'next/server'
import { alphaVantage } from '@/lib/api-clients'
import { cache } from '@/lib/redis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 1) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    const cacheKey = `search:${query.toLowerCase()}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    const results = await alphaVantage.searchSymbols(query)
    
    await cache.set(cacheKey, results, 300)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}