'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Quote } from '@/types'

interface StockCardProps {
  symbol: string
}

export default function StockCard({ symbol }: StockCardProps) {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/quote?symbol=${symbol}`)
        if (response.ok) {
          const data = await response.json()
          setQuote(data)
        }
      } catch (error) {
        console.error('Error fetching quote:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuote()
  }, [symbol])

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-600 rounded mb-2"></div>
        <div className="h-8 bg-gray-600 rounded mb-2"></div>
        <div className="h-4 bg-gray-600 rounded w-1/2"></div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="bg-surface rounded-lg p-6">
        <div className="text-gray-400">Failed to load {symbol}</div>
      </div>
    )
  }

  const isPositive = quote.change >= 0

  return (
    <Link href={`/stock/${symbol}`}>
      <div className="bg-surface rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
          <div className={`text-sm px-2 py-1 rounded ${
            isPositive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
          </div>
        </div>
        
        <div className="text-2xl font-bold text-white mb-1">
          ${quote.price.toFixed(2)}
        </div>
        
        <div className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}${quote.change.toFixed(2)} today
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>
            <div>High</div>
            <div className="text-white">${quote.high.toFixed(2)}</div>
          </div>
          <div>
            <div>Low</div>
            <div className="text-white">${quote.low.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </Link>
  )
}