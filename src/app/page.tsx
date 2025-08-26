import SearchBar from '@/components/SearchBar'
import StockCard from '@/components/StockCard'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 relative">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex justify-center items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white tracking-tight">
                Stock Predictor
              </h1>
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg">
                ALPACA POWERED
              </span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Real-time stock data and market analysis powered exclusively by Alpaca Markets API
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-12">
        {/* Popular Stocks Section */}
        <section className="mb-12 lg:mb-16">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Popular Stocks</h2>
            <div className="hidden sm:block h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent flex-1 ml-8"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
            <StockCard symbol="AAPL" />
            <StockCard symbol="GOOGL" />
            <StockCard symbol="TSLA" />
            <StockCard symbol="MSFT" />
            <StockCard symbol="NVDA" />
            <StockCard symbol="SPY" />
          </div>
        </section>

        {/* Getting Started Section */}
        <section className="glass rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center">
            Getting Started
          </h3>
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <h4 className="text-lg font-semibold text-blue-400">Setup Instructions</h4>
              </div>
              <div className="space-y-3 pl-11">
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-semibold text-sm mt-1">1.</span>
                  <p className="text-gray-300 text-sm">
                    Sign up for a free Alpaca account at{' '}
                    <a 
                      href="https://alpaca.markets/" 
                      className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30 hover:decoration-blue-300 transition-colors" 
                      target="_blank" 
                      rel="noopener"
                    >
                      alpaca.markets
                    </a>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-semibold text-sm mt-1">2.</span>
                  <p className="text-gray-300 text-sm">Get your paper trading API keys from the dashboard</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-semibold text-sm mt-1">3.</span>
                  <p className="text-gray-300 text-sm">
                    Add keys to <code className="bg-gray-700/50 px-2 py-1 rounded text-blue-300">.env.local</code> file
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400 font-semibold text-sm mt-1">4.</span>
                  <p className="text-gray-300 text-sm">Restart the development server and start trading!</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">✓</span>
                </div>
                <h4 className="text-lg font-semibold text-green-400">Features</h4>
              </div>
              <div className="space-y-3 pl-11">
                {[
                  'Real-time stock quotes and live data',
                  'Interactive charts with multiple timeframes',
                  'Smart symbol search with autocomplete',
                  'Historical data analysis (1D to 5Y)',
                  'Responsive design for all devices',
                  'Professional-grade market data'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    <p className="text-gray-300 text-sm">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
