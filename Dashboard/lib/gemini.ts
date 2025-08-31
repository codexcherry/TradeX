import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyAFOU9Zdzl2OcNLnBA1ZarSlD149YoUnqE")

// Fallback responses for when the API quota is exceeded
const fallbackResponses = {
  general: "I'm currently experiencing high demand. Please try again in a few moments. Would you like to know more about stock market basics?",
  analysis: "I'm temporarily unable to provide detailed analysis. Would you like to learn about technical indicators instead?",
  market: "Market insights are temporarily unavailable. Would you like to discuss trading strategies?"
}

function getCurrentDate() {
  const today = new Date()
  return today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function fetchStockData(symbol: string) {
  try {
    const response = await fetch(`http://localhost:3001/api/stocks/${symbol}`)
    if (!response.ok) {
      throw new Error('Failed to fetch stock data')
    }
    const data = await response.json()
    
    // Ensure we have the required data fields
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid stock data format')
    }

    // Extract and format the data
    return {
      symbol: data.symbol || symbol,
      price: parseFloat(data.price || 0).toFixed(2),
      changePercent: parseFloat(data.changePercent || 0).toFixed(2),
      volume: parseInt(data.volume || 0).toLocaleString(),
      high: parseFloat(data.high || 0).toFixed(2),
      low: parseFloat(data.low || 0).toFixed(2),
      close: parseFloat(data.close || 0).toFixed(2),
      date: getCurrentDate()
    }
  } catch (error) {
    console.error("Error fetching stock data:", error)
    throw error
  }
}

function extractStockSymbol(prompt: string): string | null {
  const patterns = [
    /stock price of (\w+)/i,
    /current price of (\w+)/i,
    /price of (\w+)/i,
    /(\w+) stock price/i,
    /(\w+) price/i,
    /how is (\w+) stock/i,
    /(\w+) market performance/i,
    /analyze (\w+)/i
  ]

  for (const pattern of patterns) {
    const match = prompt.match(pattern)
    if (match) {
      return match[1].toUpperCase()
    }
  }
  return null
}

export async function getGeminiResponse(prompt: string, context: string = "") {
  if (typeof window === 'undefined') {
    return "This feature is only available in the browser."
  }

  try {
    // Check for stock-related queries
    const symbol = extractStockSymbol(prompt)
    if (symbol) {
      try {
        const stockData = await fetchStockData(symbol)
        
        if (prompt.toLowerCase().includes('performance') || prompt.toLowerCase().includes('how is')) {
          return `Current ${symbol} Performance (as of ${stockData.date}):
- Price: $${stockData.price}
- Change: ${stockData.changePercent}%
- Volume: ${stockData.volume}
- High: $${stockData.high}
- Low: $${stockData.low}

Would you like a detailed technical analysis of ${symbol}?`
        }
        
        return `The current price of ${symbol} is $${stockData.price} (${stockData.changePercent}% change) as of ${stockData.date}. Would you like to know more about ${symbol}'s performance?`
      } catch (error) {
        return `I'm having trouble fetching data for ${symbol}. Please try again in a moment.`
      }
    }

    // Handle greetings
    if (prompt.toLowerCase().includes('hi') || prompt.toLowerCase().includes('hello')) {
      return `Hello! Today is ${getCurrentDate()}. I'm your AI Stock Market Assistant. You can ask me about stock prices, market performance, or request analysis of specific stocks. What would you like to know?`
    }

    // Use the latest model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" })
    
    const fullPrompt = `You are an AI stock market assistant. Today is ${getCurrentDate()}. Respond strictly with short, accurate, and simple one- or two-sentence answers. 
Use only verifiable stock market data—no opinions, no speculation, no extra formatting or special characters. 
Always follow your answer with a relevant question about stocks, trading, or market analysis to keep the conversation going.
DO NOT mention any dates in your response - use the date provided above.

User: ${prompt}
Assistant:`
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    })
    const response = await result.response
    return response.text()
  } catch (error: any) {
    console.error("Error calling Gemini API:", error)
    
    // Check if the error is due to quota exceeded
    if (error.message?.includes("quota") || error.message?.includes("429")) {
      return fallbackResponses.general
    }
    
    return "I apologize, but I'm having trouble processing your request at the moment. Please try again later."
  }
}

export async function analyzeStock(symbol: string) {
  if (typeof window === 'undefined') {
    return "This feature is only available in the browser."
  }

  try {
    const stockData = await fetchStockData(symbol)
    
    const prompt = `Analyze the following stock data and provide insights (as of ${stockData.date}):
    Symbol: ${stockData.symbol}
    Current Price: $${stockData.price}
    Previous Close: $${stockData.close}
    High: $${stockData.high}
    Low: $${stockData.low}
    Volume: ${stockData.volume}
    Change: ${stockData.changePercent}%
    
    Please provide:
    1. Technical Analysis
    2. Key Support/Resistance Levels
    3. Trading Volume Analysis
    4. Short-term Outlook
    5. Risk Assessment`
    
    try {
      return await getGeminiResponse(prompt)
    } catch (error: any) {
      if (error.message?.includes("quota") || error.message?.includes("429")) {
        return fallbackResponses.analysis
      }
      throw error
    }
  } catch (error) {
    console.error("Error analyzing stock:", error)
    return "I apologize, but I'm having trouble analyzing the stock data at the moment. Please try again later."
  }
}

export async function getMarketInsights() {
  if (typeof window === 'undefined') {
    return "This feature is only available in the browser."
  }

  try {
    const response = await fetch('http://localhost:3001/api/stocks')
    if (!response.ok) {
      throw new Error('Failed to fetch market data')
    }
    const stocks = await response.json()
    
    const prompt = `Analyze the current market conditions based on the following stocks: ${stocks.join(', ')} (as of ${getCurrentDate()}).
    Please provide:
    1. Overall Market Sentiment
    2. Key Market Movers
    3. Sector Performance
    4. Market Volatility Analysis
    5. Trading Recommendations`
    
    try {
      return await getGeminiResponse(prompt)
    } catch (error: any) {
      if (error.message?.includes("quota") || error.message?.includes("429")) {
        return fallbackResponses.market
      }
      throw error
    }
  } catch (error) {
    console.error("Error getting market insights:", error)
    return "I apologize, but I'm having trouble analyzing the market data at the moment. Please try again later."
  }
} 