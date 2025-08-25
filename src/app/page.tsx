import SearchBar from '@/components/SearchBar'
import StockCard from '@/components/StockCard'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">Stock Tracker</h1>
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