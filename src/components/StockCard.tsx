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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/quote?symbol=${symbol}`)
        const data = await response.json()
        
        if (response.ok) {
          setQuote(data)
        } else {
          setError(data.error || 'Failed to fetch quote')
        }
      } catch {
        setError('Network error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuote()
  }, [symbol])

  if (isLoading) {
    return (
      <div className="glass rounded-xl p-6 animate-pulse card-hover">
        <div className="h-5 bg-gray-600/50 rounded mb-3"></div>
        <div className="h-8 bg-gray-600/50 rounded mb-2"></div>
        <div className="h-4 bg-gray-600/50 rounded w-2/3 mb-4"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-gray-600/50 rounded"></div>
          <div className="h-10 bg-gray-600/50 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="glass rounded-xl p-6 card-hover border-red-500/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <h3 className="text-lg font-semibold text-white">{symbol}</h3>
        </div>
        <div className="text-red-400 text-sm mb-1">
          {error || `Failed to load ${symbol}`}
        </div>
        <div className="text-gray-500 text-xs">
          Check your Alpaca API credentials
        </div>
      </div>
    )
  }

  const isPositive = quote.change >= 0

  return (
    <Link href={`/stock/${symbol}`}>
      <div className="glass rounded-xl p-6 card-hover cursor-pointer group border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors">{symbol}</h3>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            isPositive 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%
          </div>
        </div>
        
        {/* Price */}
        <div className="mb-2">
          <div className="text-2xl lg:text-3xl font-bold text-white group-hover:text-blue-300 transition-colors">
            ${quote.price.toFixed(2)}
          </div>
          <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? '+' : ''}${Math.abs(quote.change).toFixed(2)} today
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700/50">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">High</div>
            <div className="text-sm font-semibold text-white">${quote.high.toFixed(2)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Low</div>
            <div className="text-sm font-semibold text-white">${quote.low.toFixed(2)}</div>
          </div>
        </div>
        
        {/* Volume */}
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Volume</span>
            <span className="text-xs font-semibold text-gray-300">{(quote.volume / 1000000).toFixed(1)}M</span>
          </div>
        </div>
        
        {/* Hover indicator */}
        <div className="mt-3 text-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-xs text-blue-400">Click to view details →</span>
        </div>
      </div>
    </Link>
  )
}