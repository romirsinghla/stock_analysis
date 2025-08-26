import { NextRequest, NextResponse } from 'next/server'
import { alpaca, yahooFinance, alphaVantage } from '@/lib/api-clients'
import { cache } from '@/lib/redis'
import { sampleSearchResults, sampleQuotes } from '@/lib/sample-data'

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
      console.log(`Cache hit for search: ${query}`)
      return NextResponse.json(cached)
    }

    // Try Alpaca first, then Yahoo Finance, then Alpha Vantage
    let results: any[] = []
    
    try {
      console.log(`Trying Alpaca search for: ${query}`)
      results = await alpaca.searchSymbols(query)
    } catch (error) {
      console.error('Alpaca search failed:', error)
    }
    
    if (results.length === 0) {
      try {
        console.log(`Trying Yahoo Finance search for: ${query}`)
        results = await yahooFinance.searchSymbols(query)
      } catch (error) {
        console.error('Yahoo Finance search failed:', error)
      }
    }
    
    if (results.length === 0) {
      try {
        console.log(`Trying Alpha Vantage search for: ${query}`)
        results = await alphaVantage.searchSymbols(query)
      } catch (error) {
        console.error('Alpha Vantage search failed:', error)
      }
    }
    
    // Cache for 5 minutes
    await cache.set(cacheKey, results, 300)
    console.log(`Cached search results for: ${query}`)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}