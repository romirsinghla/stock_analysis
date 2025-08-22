import SearchBar from '@/components/SearchBar'
import StockCard from '@/components/StockCard'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-white">Stock Tracker</h1>
          <span className="bg-yellow-600 text-yellow-100 px-3 py-1 rounded-full text-sm font-medium">
            DEMO MODE
          </span>
        </div>
        <p className="text-gray-400 text-sm mb-4">
          Using sample data for demonstration. Real-time API integration available.
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