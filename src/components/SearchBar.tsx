'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchResult } from '@/types'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.slice(0, 8))
          setShowResults(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleSelect = (symbol: string) => {
    setQuery('')
    setShowResults(false)
    router.push(`/stock/${symbol}`)
  }

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search stocks..."
          className="w-full px-4 py-3 bg-surface text-white rounded-lg border border-gray-600 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map((result) => (
            <div
              key={result.symbol}
              onClick={() => handleSelect(result.symbol)}
              className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-600 last:border-b-0"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-white">{result.symbol}</div>
                  <div className="text-sm text-gray-400 truncate">{result.name}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {result.region}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}