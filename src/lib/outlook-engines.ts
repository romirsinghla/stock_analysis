import type { OutlookPrediction, AnalystRecommendation, PriceTarget, Quote } from '@/types'

export interface OutlookEngine {
  name: string
  version: string
  generateOutlook(symbol: string, quote: Quote, recommendations?: AnalystRecommendation, priceTarget?: PriceTarget): Promise<OutlookPrediction>
}

export class AnalystEngine implements OutlookEngine {
  name = 'AnalystEngine'
  version = '1.0.0'

  async generateOutlook(
    symbol: string,
    quote: Quote,
    recommendations?: AnalystRecommendation,
    priceTarget?: PriceTarget
  ): Promise<OutlookPrediction> {
    const rationale: string[] = []
    let confidence = 0.5
    let summary = 'Neutral'

    if (recommendations) {
      const totalRecommendations = recommendations.buy + recommendations.hold + recommendations.sell + 
                                 recommendations.strongBuy + recommendations.strongSell
      
      if (totalRecommendations > 0) {
        const bullishRatio = (recommendations.strongBuy + recommendations.buy) / totalRecommendations
        const bearishRatio = (recommendations.strongSell + recommendations.sell) / totalRecommendations
        
        if (bullishRatio > 0.6) {
          summary = 'Bullish'
          confidence += 0.2
          rationale.push(`${Math.round(bullishRatio * 100)}% of analysts recommend buying`)
        } else if (bearishRatio > 0.4) {
          summary = 'Bearish'
          confidence += 0.1
          rationale.push(`${Math.round(bearishRatio * 100)}% of analysts recommend selling`)
        } else {
          rationale.push('Mixed analyst sentiment')
        }

        if (totalRecommendations >= 10) {
          confidence += 0.1
          rationale.push(`Strong analyst coverage with ${totalRecommendations} recommendations`)
        } else if (totalRecommendations < 5) {
          confidence -= 0.1
          rationale.push(`Limited analyst coverage with only ${totalRecommendations} recommendations`)
        }
      }
    }

    if (priceTarget && quote.price > 0) {
      const upside = (priceTarget.targetMean - quote.price) / quote.price
      
      if (upside > 0.15) {
        if (summary === 'Neutral') summary = 'Bullish'
        confidence += 0.15
        rationale.push(`Price target suggests ${Math.round(upside * 100)}% upside potential`)
      } else if (upside < -0.1) {
        summary = 'Bearish'
        confidence += 0.1
        rationale.push(`Price target suggests ${Math.round(Math.abs(upside) * 100)}% downside risk`)
      } else {
        rationale.push('Price target suggests limited movement')
      }

      if (priceTarget.numberOfAnalysts >= 8) {
        confidence += 0.05
      }
    }

    const changePercent = quote.changePercent
    if (Math.abs(changePercent) > 5) {
      if (changePercent > 0) {
        rationale.push(`Strong positive momentum with ${changePercent.toFixed(1)}% daily gain`)
      } else {
        rationale.push(`Negative momentum with ${changePercent.toFixed(1)}% daily decline`)
      }
      confidence += 0.05
    }

    const volatility = Math.abs((quote.high - quote.low) / quote.price)
    if (volatility > 0.05) {
      confidence -= 0.05
      rationale.push('High intraday volatility indicates uncertainty')
    }

    confidence = Math.max(0.1, Math.min(0.95, confidence))

    if (rationale.length === 0) {
      rationale.push('Insufficient data for detailed analysis')
    }

    return {
      symbol,
      summary,
      confidence,
      rationale,
      timeframe: '30 days',
      version: this.version,
      engine: this.name
    }
  }
}

export class ModelEngine implements OutlookEngine {
  name = 'ModelEngine'
  version = '1.0.0'

  async generateOutlook(
    symbol: string,
    quote: Quote,
    recommendations?: AnalystRecommendation,
    priceTarget?: PriceTarget
  ): Promise<OutlookPrediction> {
    return {
      symbol,
      summary: 'Model predictions coming soon',
      confidence: 0.5,
      rationale: ['ML model integration in development'],
      timeframe: '30 days',
      version: this.version,
      engine: this.name
    }
  }
}

export class BlendedEngine implements OutlookEngine {
  name = 'BlendedEngine'
  version = '1.0.0'
  private analystEngine: AnalystEngine
  private modelEngine: ModelEngine

  constructor() {
    this.analystEngine = new AnalystEngine()
    this.modelEngine = new ModelEngine()
  }

  async generateOutlook(
    symbol: string,
    quote: Quote,
    recommendations?: AnalystRecommendation,
    priceTarget?: PriceTarget
  ): Promise<OutlookPrediction> {
    const analystOutlook = await this.analystEngine.generateOutlook(symbol, quote, recommendations, priceTarget)
    
    return {
      symbol,
      summary: analystOutlook.summary,
      confidence: analystOutlook.confidence * 0.8,
      rationale: [...analystOutlook.rationale, 'Blended with model predictions (coming soon)'],
      timeframe: '30 days',
      version: this.version,
      engine: this.name
    }
  }
}

export const outlookEngines = {
  analyst: new AnalystEngine(),
  model: new ModelEngine(),
  blended: new BlendedEngine()
}