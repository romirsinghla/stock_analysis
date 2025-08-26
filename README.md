# Stock Predictor 📈

A modern stock tracking and analysis application powered exclusively by **Alpaca Markets API**. Get real-time stock quotes, historical data, and comprehensive charting for informed investment decisions.

## 📦 Archive Note

The previous version of this application (Stock-v1) is preserved in the `archive/Stock-v1/` directory for reference and historical purposes.

## ✨ Features

- **Real-time Stock Quotes**: Live price data with change indicators
- **Interactive Charts**: Historical data visualization across multiple timeframes (1D to 5Y)
- **Smart Search**: Find stocks quickly with our enhanced symbol search
- **Multiple Timeframes**: 1D, 5D, 1W, 1M, 6M, YTD, 1Y, 5Y analysis
- **Responsive Design**: Works perfectly on desktop and mobile
- **Alpaca Integration**: Direct connection to professional-grade market data

## 🚀 Getting Started

### Prerequisites

1. **Alpaca Markets Account**: Sign up for free at [alpaca.markets](https://alpaca.markets/)
2. **API Keys**: Get your paper trading API keys from the Alpaca dashboard
3. **Node.js**: Version 18 or higher

### Installation

1. **Clone & Install**
   ```bash
   cd stock_predictor
   npm install
   ```

2. **Environment Setup**
   Add your Alpaca API credentials to `.env.local`:
   ```env
   ALPACA_API_KEY=your_alpaca_api_key_here
   ALPACA_API_SECRET=your_alpaca_api_secret_here
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🔧 Configuration

### Alpaca API Setup

1. **Create Account**: Visit [alpaca.markets](https://alpaca.markets/) and sign up
2. **Get Paper Trading Keys**: 
   - Go to your dashboard
   - Navigate to "API Keys" 
   - Generate paper trading keys (safe for testing)
3. **Add to Environment**: Update your `.env.local` file with the credentials

### Supported Markets

- **US Equities**: All major US stocks (NASDAQ, NYSE)
- **ETFs**: Popular ETFs like SPY, QQQ, VTI
- **Market Hours**: 9:30 AM - 4:00 PM EST (Monday-Friday)

## 📊 API Endpoints

The application includes several API routes:

- `GET /api/quote?symbol=AAPL` - Get real-time quote
- `GET /api/chart?symbol=AAPL&timeframe=1D` - Get historical data
- `GET /api/search?q=apple` - Search for symbols
- `GET /api/company?symbol=AAPL` - Get company information

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **API**: Alpaca Markets (exclusive)
- **HTTP Client**: Axios

## 📱 Usage

### Search for Stocks
Use the search bar on the homepage to find stocks by symbol or company name.

### View Stock Details  
Click on any stock card to see detailed charts and analysis.

### Change Timeframes
Use the timeframe buttons (1D, 5D, 1W, etc.) to analyze different periods.

### Real-time Data
All data is fetched directly from Alpaca Markets API with professional-grade accuracy.

## 🔒 Security Notes

- **Paper Trading**: Uses paper trading API by default (safe for testing)
- **Environment Variables**: API keys are stored securely in environment variables
- **No Financial Advice**: This tool is for informational purposes only

## 🆘 Troubleshooting

### "API credentials not configured"
- Check your `.env.local` file has the correct API keys
- Ensure you've restarted the development server after adding keys

### "No data available"
- Verify your API keys are active
- Check if the market is open (data is limited on weekends)
- Try a different stock symbol

### Build Issues
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

## 🔗 Links

- [Alpaca Markets](https://alpaca.markets/) - Get your API keys
- [Alpaca API Docs](https://docs.alpaca.markets/) - Comprehensive API documentation
- [Next.js Docs](https://nextjs.org/docs) - Framework documentation
