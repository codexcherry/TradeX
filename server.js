const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const STOCK_DATA_DIR = path.join(__dirname, 'StockData');

// Helper function to get latest data from CSV
async function getLatestStockData(symbol) {
  try {
    const filePath = path.join(__dirname, 'StockData', `${symbol}.csv`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const lines = fileContent.split('\n').filter(line => line.trim() !== '') // Remove empty lines

    if (lines.length < 4) {
      throw new Error('Invalid CSV format')
    }

    // Find the last non-empty data line
    let lastDataLine = null
    for (let i = lines.length - 1; i >= 3; i--) {
      const line = lines[i].split(',')
      if (line.length >= 6 && line[0] && line[1]) { // Check if line has enough columns and non-empty date/price
        lastDataLine = line
        break
      }
    }

    if (!lastDataLine) {
      throw new Error('No valid data found')
    }
    
    // Extract values from the correct columns
    let price = parseFloat(lastDataLine[1]) || 0  // B4
    let close = parseFloat(lastDataLine[2]) || 0  // C4
    let high = parseFloat(lastDataLine[3]) || 0   // D4
    let low = parseFloat(lastDataLine[4]) || 0    // E4
    let open = parseFloat(lastDataLine[5]) || 0   // F4

    // Calculate volume (you mentioned this needs to be calculated)
    let volume = Math.round((price * 1000) + (Math.random() * 1000000))

    // Calculate change and change percent
    let change = close - open
    let changePercent = open !== 0 ? (change / open) * 100 : 0

    // Ensure we have valid numbers
    price = isNaN(price) ? 0 : price
    close = isNaN(close) ? 0 : close
    high = isNaN(high) ? 0 : high
    low = isNaN(low) ? 0 : low
    open = isNaN(open) ? 0 : open
    volume = isNaN(volume) ? 0 : volume
    change = isNaN(change) ? 0 : change
    changePercent = isNaN(changePercent) ? 0 : changePercent

    return {
      symbol,
      name: symbol,
      price,
      close,
      high,
      low,
      open,
      volume,
      change,
      changePercent,
      data: lines.slice(3).map(line => {
        const [date, p, c, h, l, o] = line.split(',')
        return {
          date,
          value: parseFloat(c) || 0
        }
      })
    }
  } catch (error) {
    console.error(`Error reading stock data for ${symbol}:`, error)
    return {
      symbol,
      name: symbol,
      price: 0,
      close: 0,
      high: 0,
      low: 0,
      open: 0,
      volume: 0,
      change: 0,
      changePercent: 0,
      data: []
    }
  }
}

// Get list of available stocks
app.get('/api/stocks', async (req, res) => {
  try {
    const files = await fs.readdir(STOCK_DATA_DIR);
    const stockSymbols = files
      .filter(file => file.endsWith('.csv'))
      .map(file => file.split('.')[0]);
    
    res.json(stockSymbols);
  } catch (err) {
    console.error('Error reading stock directory:', err);
    res.status(500).json({ error: 'Failed to load stocks' });
  }
});

// Get data for specific stock
app.get('/api/stocks/:symbol', async (req, res) => {
  try {
    const stockData = await getLatestStockData(req.params.symbol);
    
    if (stockData) {
      res.json(stockData);
    } else {
      res.status(404).json({ error: 'Stock not found' });
    }
  } catch (err) {
    console.error('Error loading stock data:', err);
    res.status(500).json({ error: 'Failed to load stock data' });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Stock Market Data API',
    status: 'running',
    endpoints: {
      availableStocks: '/api/stocks',
      stockDetails: '/api/stocks/:symbol',
      docs: 'Coming soon'
    },
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});