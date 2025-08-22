import { NextRequest, NextResponse } from 'next/server'
import { yahooFinance, alphaVantage } from '@/lib/api-clients'
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

    // DEMO MODE: Use sample data for search (skip cache for speed)
    const lowerQuery = query.toLowerCase()
    
    // Create expanded search data including company names
    const searchableData = [
      { symbol: 'AAPL', name: 'Apple Inc.', keywords: ['apple', 'iphone', 'mac'] },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', keywords: ['google', 'alphabet', 'search', 'android'] },
      { symbol: 'TSLA', name: 'Tesla, Inc.', keywords: ['tesla', 'electric', 'musk', 'ev'] },
      { symbol: 'MSFT', name: 'Microsoft Corporation', keywords: ['microsoft', 'windows', 'office', 'azure'] },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', keywords: ['nvidia', 'gpu', 'graphics', 'ai'] }
    ]
    
    const results = searchableData
      .filter(item => 
        item.symbol.toLowerCase().includes(lowerQuery) ||
        item.name.toLowerCase().includes(lowerQuery) ||
        item.keywords.some(keyword => keyword.includes(lowerQuery))
      )
      .map(item => ({
        symbol: item.symbol,
        name: item.name,
        type: 'Equity',
        region: 'US',
        marketOpen: '09:30',
        marketClose: '16:00',
        timezone: 'US/Eastern',
        currency: 'USD',
        matchScore: item.symbol.toLowerCase() === lowerQuery ? 1.0 : 0.8
      }))
      .slice(0, 5) // Limit results

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}