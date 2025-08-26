import { NextRequest, NextResponse } from 'next/server'
import { alpacaClient } from '@/lib/alpaca-client'

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

    console.log(`Fetching quote for ${symbol} from Alpaca...`)
    const quote = await alpacaClient.getQuote(symbol.toUpperCase())
    
    return NextResponse.json(quote)
  } catch (error) {
    console.error('Quote API error:', error)
    
    // Return specific error messages for better debugging
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('credentials not configured') ? 401 : 
                      errorMessage.includes('No quote data available') ? 404 : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}