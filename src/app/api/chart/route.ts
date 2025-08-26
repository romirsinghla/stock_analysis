import { NextRequest, NextResponse } from 'next/server'
import { alpaca, alphaVantage } from '@/lib/api-clients'
import { cache } from '@/lib/redis'
import { generateChartData } from '@/lib/sample-data'
import type { TimeFrame } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const timeframe = searchParams.get('timeframe') as TimeFrame || '1D'

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    const cacheKey = `chart:${symbol.toUpperCase()}:${timeframe}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    // Try Alpaca first, then Alpha Vantage as fallback
    let chartData: any[] = []
    
    try {
      console.log(`Trying Alpaca for ${symbol} chart data...`)
      chartData = await alpaca.getHistoricalData(symbol.toUpperCase(), timeframe)
    } catch (error) {
      console.error('Alpaca chart data failed:', error)
    }
    
    if (chartData.length === 0) {
      try {
        console.log(`Trying Alpha Vantage for ${symbol} chart data...`)
        chartData = await alphaVantage.getHistoricalData(symbol.toUpperCase(), timeframe)
      } catch (error) {
        console.error('Alpha Vantage chart data failed:', error)
      }
    }
    
    // If both APIs fail, use sample data as fallback
    if (chartData.length === 0) {
      console.log(`Using sample data for ${symbol}...`)
      chartData = generateChartData(symbol.toUpperCase(), timeframe)
    }
    
    const ttl = timeframe === '1D' ? 60 : timeframe === '5D' ? 300 : 3600
    await cache.set(cacheKey, chartData, ttl)

    return NextResponse.json(chartData)
  } catch (error) {
    console.error('Chart API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}