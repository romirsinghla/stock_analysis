import { NextRequest, NextResponse } from 'next/server'
import { finnhub } from '@/lib/api-clients'
import { cache } from '@/lib/redis'
import { sampleCompanies } from '@/lib/sample-data'

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

    const cacheKey = `company:${symbol.toUpperCase()}`
    const cached = await cache.get(cacheKey)
    
    if (cached) {
      return NextResponse.json(cached)
    }

    // DEMO MODE: Use sample company data
    const company = sampleCompanies[symbol.toUpperCase()]
    
    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    await cache.set(cacheKey, company, 3600)

    return NextResponse.json(company)
  } catch (error) {
    console.error('Company API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}