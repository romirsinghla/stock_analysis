import StockChart from '@/components/StockChart'
import StockInfo from '@/components/StockInfo'
import OutlookCard from '@/components/OutlookCard'

interface StockPageProps {
  params: Promise<{
    symbol: string
  }>
}

export default async function StockPage({ params }: StockPageProps) {
  const { symbol } = await params
  const upperSymbol = symbol.toUpperCase()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">{upperSymbol}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StockChart symbol={upperSymbol} />
          <StockInfo symbol={upperSymbol} />
        </div>
        
        <div className="space-y-6">
          <OutlookCard symbol={upperSymbol} />
        </div>
      </div>
    </div>
  )
}