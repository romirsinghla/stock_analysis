import StockChart from '@/components/StockChart'
import Link from 'next/link'

interface StockPageProps {
  params: Promise<{
    symbol: string
  }>
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params
  const upperSymbol = symbol.toUpperCase()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {upperSymbol}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                LIVE DATA
              </span>
              <span className="bg-gray-700/50 text-gray-300 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-gray-600/50">
                Alpaca Markets
              </span>
            </div>
          </div>
          
          <p className="text-gray-400 text-base sm:text-lg mt-4">
            Real-time market data and comprehensive charting analysis
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        <div className="space-y-8">
          {/* Chart Section */}
          <section>
            <StockChart symbol={upperSymbol} />
          </section>
          
          {/* Info Section */}
          <section className="glass rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">About {upperSymbol}</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-4">Real-Time Analysis</h4>
                <p className="text-gray-300 leading-relaxed">
                  View comprehensive stock data powered by Alpaca Markets API. Track price movements, 
                  analyze trends across multiple timeframes, and make informed investment decisions with 
                  professional-grade market data.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-4">Available Features</h4>
                <div className="space-y-3">
                  {[
                    'Live price quotes and market data',
                    'Interactive charts with multiple timeframes',
                    'Historical price analysis (1D to 5Y)',
                    'Professional trading insights',
                    'Real-time market updates'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-300 text-sm font-semibold">Market Data Disclaimer</p>
                  <p className="text-blue-200/80 text-xs mt-1">
                    This application provides market data for informational purposes only. 
                    Not intended as financial advice. Past performance does not guarantee future results.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}