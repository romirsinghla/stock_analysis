# Stock Tracker

A Robinhood-style stock tracking web application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Stock Quotes**: Live pricing data from Finnhub API
- **Interactive Charts**: Multi-timeframe charts (1D, 5D, 1M, 6M, YTD, 1Y, 5Y) using Recharts
- **Stock Search**: Debounced search with Alpha Vantage symbol search
- **Company Information**: Detailed company profiles and financial data
- **Analyst Predictions**: Short-term outlook using pluggable prediction engines
- **Redis Caching**: Aggressive caching for optimal performance
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Backend**: Next.js API Routes
- **Data Sources**: Alpha Vantage (historical data), Finnhub (real-time quotes)
- **Caching**: Redis
- **Deployment**: Vercel/Netlify ready

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd stock-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local` and update with your API keys:
   ```bash
   # Get your free API keys from:
   # Alpha Vantage: https://www.alphavantage.co/support/#api-key
   # Finnhub: https://finnhub.io/register
   
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
   FINNHUB_API_KEY=your_finnhub_key_here
   REDIS_URL=redis://localhost:6379
   ```

4. **Set up Redis (optional but recommended)**
   
   **Using Docker:**
   ```bash
   docker run -d -p 6379:6379 redis:alpine
   ```
   
   **Using Homebrew (macOS):**
   ```bash
   brew install redis
   brew services start redis
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

- `GET /api/search?q={query}` - Search for stock symbols
- `GET /api/quote?symbol={symbol}` - Get real-time quote
- `GET /api/chart?symbol={symbol}&timeframe={timeframe}` - Get historical chart data
- `GET /api/company?symbol={symbol}` - Get company information
- `GET /api/analyst?symbol={symbol}` - Get analyst recommendations and price targets
- `GET /api/outlook?symbol={symbol}&engine={engine}` - Get short-term prediction

## Prediction Engines

The application uses a pluggable prediction engine system:

- **AnalystEngine**: Deterministic rules based on analyst consensus, price targets, and momentum
- **ModelEngine**: Placeholder for future ML model integration
- **BlendedEngine**: Combines multiple prediction sources

## Caching Strategy

- **Search results**: 5 minutes
- **Real-time quotes**: 30 seconds
- **Chart data**: 1 minute (1D), 5 minutes (5D), 1 hour (longer timeframes)
- **Company data**: 1 hour
- **Analyst data**: 1 hour
- **Predictions**: 30 minutes

## Future Enhancements

- **ML Integration**: Ready for ML model deployment with clean `/predict` API
- **Real-time Updates**: WebSocket support for live price updates
- **Portfolio Tracking**: User accounts and portfolio management
- **Advanced Analytics**: Technical indicators and more sophisticated analysis
- **Mobile App**: React Native mobile application

## Performance Notes

- All API calls are cached with Redis for optimal performance
- Components use React hooks for efficient state management
- Debounced search prevents excessive API calls
- Charts are optimized for smooth rendering across timeframes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details