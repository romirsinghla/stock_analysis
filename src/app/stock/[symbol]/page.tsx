import StockChart from '@/components/StockChart'
import StockInfo from '@/components/StockInfo'
import OutlookCard from '@/components/OutlookCard'

interface StockPageProps {
  params: {
    symbol: string
  }
}

export default function StockPage({ params }: StockPageProps) {
  const symbol = params.symbol.toUpperCase()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{symbol}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StockChart symbol={symbol} />
          <StockInfo symbol={symbol} />
        </div>
        
        <div className="space-y-6">
          <OutlookCard symbol={symbol} />
        </div>
      </div>
    </div>
  )
}