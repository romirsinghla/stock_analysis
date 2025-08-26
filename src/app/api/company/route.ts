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

    console.log(`Fetching company info for ${symbol}...`)
    const company = await alpacaClient.getCompanyProfile(symbol.toUpperCase())
    
    return NextResponse.json(company)
  } catch (error) {
    console.error('Company API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}