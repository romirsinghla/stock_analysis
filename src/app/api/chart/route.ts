import { NextRequest, NextResponse } from 'next/server'
import { alpacaClient } from '@/lib/alpaca-client'
import type { TimeFrame } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const timeframe = (searchParams.get('timeframe') as TimeFrame) || '1D'

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    console.log(`Fetching chart data for ${symbol} (${timeframe}) from Alpaca...`)
    const chartData = await alpacaClient.getHistoricalData(symbol.toUpperCase(), timeframe)
    
    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Chart API error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    const statusCode = errorMessage.includes('credentials not configured') ? 401 : 
                      errorMessage.includes('No data available') ? 404 : 500
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}