import { NextRequest, NextResponse } from 'next/server'
import { alpacaClient } from '@/lib/alpaca-client'

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

    console.log(`Searching for symbols: ${query}`)
    const results = await alpacaClient.searchSymbols(query)
    
    return NextResponse.json(results)
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}