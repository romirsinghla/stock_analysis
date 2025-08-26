import SearchBar from '@/components/SearchBar'
import StockCard from '@/components/StockCard'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-white">Stock Tracker</h1>
          <span className="bg-blue-600 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">
            ALPACA POWERED
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Real-time stock data powered by Alpaca Markets API with historical bars and quotes.
        </p>
        <SearchBar />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StockCard symbol="AAPL" />
        <StockCard symbol="GOOGL" />
        <StockCard symbol="TSLA" />
      </div>
    </main>
  )
}