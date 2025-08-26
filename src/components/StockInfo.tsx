'use client'

import { useState, useEffect } from 'react'
import type { Quote, Company } from '@/types'

interface StockInfoProps {
  symbol: string
}

export default function StockInfo({ symbol }: StockInfoProps) {
  const [quote, setQuote] = useState<Quote | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quoteResponse, companyResponse] = await Promise.all([
          fetch(`/api/quote?symbol=${symbol}`),
          fetch(`/api/company?symbol=${symbol}`)
        ])

        if (quoteResponse.ok) {
          const quoteData = await quoteResponse.json()
          setQuote(quoteData)
        }

        if (companyResponse.ok) {
          const companyData = await companyResponse.json()
          setCompany(companyData)
        }
      } catch (error) {
        console.error('Error fetching stock info:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [symbol])

  if (isLoading) {
    return (
      <div className="bg-surface rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-600 rounded mb-4"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-600 rounded"></div>
              <div className="h-6 bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const isPositive = quote ? quote.change >= 0 : false

  return (
    <div className="bg-surface rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{company?.name || symbol}</h2>
          {quote && (
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-3xl font-bold text-white">
                ${quote.price.toFixed(2)}
              </span>
              <span className={`text-lg ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}${quote.change.toFixed(2)} ({isPositive ? '+' : ''}{quote.changePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
        {company?.logo && (
          <img 
            src={company.logo} 
            alt={`${symbol} logo`}
            className="w-12 h-12 rounded-lg"
          />
        )}
      </div>

      {quote && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-gray-400 text-sm">Open</div>
            <div className="text-white font-semibold">${quote.open.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">High</div>
            <div className="text-white font-semibold">${quote.high.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Low</div>
            <div className="text-white font-semibold">${quote.low.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-gray-400 text-sm">Previous Close</div>
            <div className="text-white font-semibold">${quote.previousClose.toFixed(2)}</div>
          </div>
        </div>
      )}

      {company && (
        <div className="mt-6 pt-6 border-t border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Company Info</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {company.sector && (
              <div>
                <div className="text-gray-400 text-sm">Sector</div>
                <div className="text-white">{company.sector}</div>
              </div>
            )}
            {company.industry && (
              <div>
                <div className="text-gray-400 text-sm">Industry</div>
                <div className="text-white">{company.industry}</div>
              </div>
            )}
            {company.employees && (
              <div>
                <div className="text-gray-400 text-sm">Employees</div>
                <div className="text-white">{company.employees.toLocaleString()}</div>
              </div>
            )}
            {company.marketCap && (
              <div>
                <div className="text-gray-400 text-sm">Market Cap</div>
                <div className="text-white">${company.marketCap.toLocaleString()}M</div>
              </div>
            )}
          </div>
          {company.website && (
            <div className="mt-4">
              <a 
                href={company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 text-sm"
              >
                Visit Website →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}