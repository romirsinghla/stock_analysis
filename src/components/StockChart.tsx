'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartData, TimeFrame } from '@/types'

interface StockChartProps {
  symbol: string
}

const timeframes: { label: string; value: TimeFrame }[] = [
  { label: '1D', value: '1D' },
  { label: '5D', value: '5D' },
  { label: '1W', value: '1W' },
  { label: '1M', value: '1M' },
  { label: '6M', value: '6M' },
  { label: 'YTD', value: 'YTD' },
  { label: '1Y', value: '1Y' },
  { label: '5Y', value: '5Y' },
]

export default function StockChart({ symbol }: StockChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1D')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/chart?symbol=${symbol}&timeframe=${selectedTimeframe}`)
        const chartData = await response.json()
        
        if (response.ok) {
          setData(chartData)
        } else {
          setError(chartData.error || 'Failed to fetch chart data')
        }
      } catch {
        setError('Network error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [symbol, selectedTimeframe])

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    if (selectedTimeframe === '1D') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'close') {
      return [`$${value.toFixed(2)}`, 'Price']
    }
    return [value, name]
  }

  const formatTooltipLabel = (label: number) => {
    const date = new Date(label)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: selectedTimeframe === '1D' ? '2-digit' : undefined,
      minute: selectedTimeframe === '1D' ? '2-digit' : undefined,
    })
  }

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-gray-600/50 rounded-lg w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="h-8 w-12 bg-gray-600/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
        <div className="h-80 bg-gray-600/50 rounded-xl animate-pulse"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass rounded-2xl p-6 sm:p-8 border-red-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-white">{symbol} Chart</h3>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="text-red-400 mb-2 font-semibold">{error}</div>
          <div className="text-gray-400 text-sm">
            Make sure your Alpaca API credentials are configured correctly
          </div>
        </div>
      </div>
    )
  }

  const latestPrice = data.length > 0 ? data[data.length - 1].close : 0
  const firstPrice = data.length > 0 ? data[0].close : 0
  const priceChange = latestPrice - firstPrice
  const priceChangePercent = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0
  const isPositive = priceChange >= 0

  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{symbol} Chart</h3>
            {data.length > 0 && (
              <div className={`text-sm sm:text-base font-semibold flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                <span>{isPositive ? '↗' : '↘'}</span>
                <span>
                  {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)} ({isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%)
                </span>
                <span className="text-xs text-gray-400">({selectedTimeframe})</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Timeframe Buttons */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setSelectedTimeframe(tf.value)}
              className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedTimeframe === tf.value
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white border border-gray-600/30 hover:border-gray-500/50'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {data.length > 0 ? (
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="2 4" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatDate}
                stroke="#9CA3AF"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                stroke="#9CA3AF"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={60}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.95)', 
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(75, 85, 99, 0.5)', 
                  borderRadius: '12px',
                  color: '#F9FAFB',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
                }}
                formatter={formatTooltipValue}
                labelFormatter={formatTooltipLabel}
                cursor={{
                  stroke: isPositive ? '#10B981' : '#EF4444',
                  strokeWidth: 1,
                  strokeDasharray: '3 3'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke={isPositive ? '#10B981' : '#EF4444'}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ 
                  r: 5, 
                  fill: isPositive ? '#10B981' : '#EF4444',
                  stroke: '#ffffff',
                  strokeWidth: 2
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-80 flex flex-col items-center justify-center text-gray-400">
          <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-center">No data available for the selected timeframe</p>
          <p className="text-sm text-gray-500 mt-1">Try a different time period</p>
        </div>
      )}
    </div>
  )
}