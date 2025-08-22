'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { ChartData, TimeFrame } from '@/types'

interface StockChartProps {
  symbol: string
}

const timeframes: { value: TimeFrame; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '5D', label: '5D' },
  { value: '1M', label: '1M' },
  { value: '6M', label: '6M' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1Y' },
  { value: '5Y', label: '5Y' },
]

export default function StockChart({ symbol }: StockChartProps) {
  const [data, setData] = useState<ChartData[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>('1M')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/chart?symbol=${symbol}&timeframe=${selectedTimeframe}`)
        if (response.ok) {
          const chartData = await response.json()
          setData(chartData)
        }
      } catch (error) {
        console.error('Error fetching chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChartData()
  }, [symbol, selectedTimeframe])

  const formatData = data.map(item => ({
    ...item,
    date: new Date(item.timestamp).toLocaleDateString(),
    price: item.close
  }))

  const isPositiveTrend = data.length > 1 && data[data.length - 1].close > data[0].close

  return (
    <div className="bg-surface rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Price Chart</h2>
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setSelectedTimeframe(tf.value)}
              className={`px-3 py-1 text-sm rounded ${
                selectedTimeframe === tf.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-400">
          No data available for this timeframe
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickCount={6}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositiveTrend ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: isPositiveTrend ? '#10B981' : '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}