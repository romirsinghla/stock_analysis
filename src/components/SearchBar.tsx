'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SearchResult } from '@/types'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const router = useRouter()

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.length < 1) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (response.ok) {
        setResults(data)
        setShowResults(true)
      } else {
        console.error('Search error:', data.error)
        setResults([])
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/stock/${query.toUpperCase()}`)
    }
  }

  const handleSelectResult = (symbol: string) => {
    setQuery('')
    setResults([])
    setShowResults(false)
    router.push(`/stock/${symbol}`)
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              handleSearch(e.target.value)
            }}
            onFocus={() => query && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            placeholder="Search stocks (e.g., AAPL, TSLA, SPY)..."
            className="w-full px-6 py-4 pl-12 bg-gray-800/80 backdrop-blur-sm text-white border border-gray-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 group-hover:bg-gray-800/90 text-base sm:text-lg"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-blue-500/25"
          >
            Search
          </button>
        </div>
      </form>

      {showResults && (results.length > 0 || isLoading) && (
        <div className="absolute z-50 w-full mt-3 glass rounded-2xl shadow-2xl max-h-80 overflow-hidden border border-gray-600/30">
          {isLoading && (
            <div className="p-6 text-center">
              <div className="inline-flex items-center gap-2 text-gray-300">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </div>
            </div>
          )}
          <div className="max-h-80 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={result.symbol}
                onClick={() => handleSelectResult(result.symbol)}
                className={`p-4 hover:bg-gray-700/50 cursor-pointer transition-all duration-200 ${
                  index !== results.length - 1 ? 'border-b border-gray-700/30' : ''
                } group`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {result.symbol}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors pl-3.5">
                      {result.name}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/30">
                      {result.type}
                    </span>
                    <span className="text-xs text-gray-500">{result.region}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {results.length > 0 && (
            <div className="p-3 border-t border-gray-700/30 text-center">
              <span className="text-xs text-gray-500">Press Enter or click to view details</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}