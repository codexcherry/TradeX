# TradeX - Stock Trading Platform

A modern, feature-rich stock trading and analysis platform built with Next.js, featuring real-time stock data, AI-powered insights, and advanced charting capabilities.

## 🚀 Features

### Core Functionality
- **Real-time Stock Data**: Live stock prices, charts, and market data
- **Interactive Charts**: Advanced candlestick charts with multiple timeframes (1D, 1W, 1M, 3M, 1Y)
- **AI-Powered Analysis**: Gemini AI integration for stock analysis and market insights
- **Watchlist Management**: Create and manage personalized stock watchlists
- **Technical Indicators**: RSI, MACD, Moving Averages, and more
- **Stock Forecasting**: Predictive analytics and price forecasting
- **Market Insights**: AI-generated market trends and analysis

### User Interface
- **Modern Dark Theme**: Sleek, pixelated background design
- **Responsive Design**: Mobile-friendly interface
- **Interactive Components**: Smooth animations and transitions
- **Real-time Updates**: Live data refresh and notifications
- **Advanced Filtering**: Sector-based stock filtering
- **Pagination**: Efficient data loading for large datasets

### AI Assistant
- **Natural Language Queries**: Ask questions about stocks in plain English
- **Stock Analysis**: Get detailed analysis for specific stocks
- **Market Overview**: AI-generated market insights and trends
- **Trading Recommendations**: AI-powered trading suggestions

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.2.4**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives
- **Lightweight Charts**: High-performance financial charts
- **Lucide React**: Beautiful icons

### Backend & APIs
- **Node.js/Express**: Backend server for stock data
- **Yahoo Finance API**: Real-time stock data
- **Alpha Vantage API**: Market data and forecasting
- **Google Gemini AI**: AI-powered analysis and insights
- **yfinance**: Python library for stock data

### Data Management
- **CSV Data Storage**: Local stock data files
- **Real-time Processing**: Live data transformation and analysis
- **Caching**: Optimized data retrieval

## 📁 Project Structure

```
TradeX/
├── README.md                 # Main documentation
├── PROJECT_STRUCTURE.md      # Detailed structure guide
├── .gitignore               # Git ignore rules
├── package.json             # Root package with scripts
├── server.js                # Express backend server
├── Dashboard/               # Next.js frontend application
│   ├── app/                 # App Router pages & API routes
│   ├── components/          # UI components (shadcn/ui)
│   ├── lib/                 # Utilities & configurations
│   ├── types/               # TypeScript definitions
│   ├── public/              # Static assets
│   └── env.example          # Environment template
└── StockData/               # CSV stock data files
```

📋 **For detailed structure, see [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Google Gemini API key
- Alpha Vantage API key (optional)

### Installation

1. **Clone the repository**
       ```bash
    git clone https://github.com/codexcherry/TradeX.git
    cd TradeX
    ```

2. **Install all dependencies**
   ```bash
   npm run install-deps
   ```

3. **Environment Setup**
   Copy the environment template and add your API keys:
   ```bash
   cp Dashboard/env.example Dashboard/.env.local
   ```
   
   Edit `Dashboard/.env.local` and add your API keys:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This will start both:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:3001`

## 📊 Data Sources

### Stock Data
- **Primary**: Yahoo Finance API for real-time data
- **Secondary**: Local CSV files in `StockData/` directory
- **Forecasting**: Alpha Vantage API for predictive analytics

### AI Integration
- **Google Gemini**: Natural language processing and analysis
- **Custom Prompts**: Specialized prompts for stock analysis
- **Fallback Responses**: Graceful handling of API limits

## 🎯 Key Features Explained

### Stock Chart Component
- **Multiple Timeframes**: 1D, 1W, 1M, 3M, 1Y views
- **Interactive Charts**: Zoom, pan, and hover functionality
- **Technical Indicators**: RSI, MACD, Moving Averages
- **Real-time Updates**: Live price updates and chart refresh

### AI Assistant
- **Natural Language**: Ask questions like "Analyze AAPL" or "How is the market?"
- **Context Awareness**: Understands stock symbols and market terminology
- **Real-time Data**: Integrates live stock data into responses
- **Interactive Chat**: Smooth conversation flow with typing indicators

### Watchlist Management
- **Personalized Lists**: Create custom stock watchlists
- **Real-time Tracking**: Live updates for watched stocks
- **Performance Metrics**: Track gains/losses over time
- **Quick Actions**: Add/remove stocks with one click

## 🔧 Configuration

### API Keys
- **Gemini API**: Required for AI features
- **Alpha Vantage**: Optional for enhanced forecasting
- **Yahoo Finance**: No key required (public API)

### Server Configuration
- **Port**: Backend runs on port 3001
- **CORS**: Configured for localhost development
- **Data Directory**: Points to `StockData/` folder

### Chart Configuration
- **Theme**: Dark mode with custom colors
- **Timeframes**: Configurable chart periods
- **Indicators**: Customizable technical indicators

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
npm run build

# Start production servers
npm start
```

### Environment Variables
Ensure all required environment variables are set in production:
- `NEXT_PUBLIC_GEMINI_API_KEY`
- `ALPHA_VANTAGE_API_KEY` (optional)

### Deployment Options
- **Frontend**: Deploy to Vercel, Netlify, or any Next.js hosting platform
- **Backend**: Deploy `server.js` to Railway, Heroku, or any Node.js hosting platform
- **Full Stack**: Deploy both together on platforms like Railway or Render

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Portfolio tracking
- [ ] Advanced order types
- [ ] Social trading features
- [ ] Mobile app
- [ ] More technical indicators
- [ ] Backtesting capabilities
- [ ] News integration

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**
