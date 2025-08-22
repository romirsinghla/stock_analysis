'use client'

import { useState, useEffect } from 'react'
import type { OutlookPrediction } from '@/types'

interface OutlookCardProps {
  symbol: string
}

export default function OutlookCard({ symbol }: OutlookCardProps) {
  const [outlook, setOutlook] = useState<OutlookPrediction | null>(null)
  const [selectedEngine, setSelectedEngine] = useState('analyst')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOutlook = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/outlook?symbol=${symbol}&engine=${selectedEngine}`)
        if (response.ok) {
          const data = await response.json()
          setOutlook(data)
        }
      } catch (error) {
        console.error('Error fetching outlook:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOutlook()
  }, [symbol, selectedEngine])

  const getSummaryColor = (summary: string) => {
    switch (summary.toLowerCase()) {
      case 'bullish':
        return 'text-green-400 bg-green-900'
      case 'bearish':
        return 'text-red-400 bg-red-900'
      default:
        return 'text-yellow-400 bg-yellow-900'
    }
  }

  const getConfidenceBar = (confidence: number) => {
    const percentage = confidence * 100
    let colorClass = 'bg-red-500'
    
    if (percentage >= 70) colorClass = 'bg-green-500'
    else if (percentage >= 50) colorClass = 'bg-yellow-500'
    
    return { percentage, colorClass }
  }

  return (
    <div className="bg-surface rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Short Prediction</h3>
        <select
          value={selectedEngine}
          onChange={(e) => setSelectedEngine(e.target.value)}
          className="bg-gray-600 text-white text-sm rounded px-2 py-1 border border-gray-500 focus:outline-none focus:border-primary"
        >
          <option value="analyst">Analyst Engine</option>
          <option value="model">Model Engine</option>
          <option value="blended">Blended Engine</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-gray-600 rounded"></div>
          <div className="h-4 bg-gray-600 rounded"></div>
          <div className="h-16 bg-gray-600 rounded"></div>
        </div>
      ) : outlook ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSummaryColor(outlook.summary)}`}>
              {outlook.summary}
            </span>
            <span className="text-gray-400 text-sm">{outlook.timeframe}</span>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-sm">Confidence</span>
              <span className="text-white text-sm">{(outlook.confidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getConfidenceBar(outlook.confidence).colorClass}`}
                style={{ width: `${getConfidenceBar(outlook.confidence).percentage}%` }}
              ></div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Analysis</h4>
            <ul className="space-y-1">
              {outlook.rationale.map((reason, index) => (
                <li key={index} className="text-gray-300 text-sm flex items-start">
                  <span className="text-primary mr-2">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-gray-600">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Engine: {outlook.engine}</span>
              <span>v{outlook.version}</span>
            </div>
          </div>

          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
            <p className="text-yellow-300 text-xs">
              ⚠️ This prediction is for informational purposes only and should not be considered as financial advice. 
              Always do your own research before making investment decisions.
            </p>
          </div>
        </div>
      ) : (
        <div className="text-gray-400 text-center py-8">
          Failed to load prediction
        </div>
      )}
    </div>
  )
}