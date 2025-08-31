"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Star, StarOff, TrendingUp, Download } from "lucide-react"
import { motion } from "framer-motion"
import PixelatedBackground from "@/components/pixelated-background"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  isInWatchlist: boolean
}

export default function WatchlistPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [stocks, setStocks] = useState<Stock[]>([])
  const [watchlist, setWatchlist] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('watchlist')
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist))
    }
  }, [])

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  // Popular stocks to show by default
  const popularStocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 170.33, change: 1.23, isInWatchlist: false },
    { symbol: "MSFT", name: "Microsoft Corporation", price: 330.12, change: -0.45, isInWatchlist: false },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 145.67, change: 2.34, isInWatchlist: false },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 180.45, change: -1.12, isInWatchlist: false },
    { symbol: "META", name: "Meta Platforms Inc.", price: 475.89, change: 3.45, isInWatchlist: false },
  ]

  // Recommended stocks based on AI analysis
  const recommendedStocks = [
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 890.34, change: 5.67, isInWatchlist: false },
    { symbol: "TSLA", name: "Tesla Inc.", price: 175.23, change: -2.34, isInWatchlist: false },
    { symbol: "AMD", name: "Advanced Micro Devices", price: 178.45, change: 1.23, isInWatchlist: false },
  ]

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const allStocks = [...popularStocks, ...recommendedStocks]
      // Update isInWatchlist based on saved watchlist
      const updatedStocks = allStocks.map(stock => ({
        ...stock,
        isInWatchlist: watchlist.some(w => w.symbol === stock.symbol)
      }))
      setStocks(updatedStocks)
      setLoading(false)
    }, 1000)
  }, [watchlist])

  const handleAddToWatchlist = (stock: Stock) => {
    const updatedStock = { ...stock, isInWatchlist: true }
    setWatchlist([...watchlist, updatedStock])
    setStocks(stocks.map(s => s.symbol === stock.symbol ? updatedStock : s))
  }

  const handleRemoveFromWatchlist = (stock: Stock) => {
    const updatedStock = { ...stock, isInWatchlist: false }
    setWatchlist(watchlist.filter(s => s.symbol !== stock.symbol))
    setStocks(stocks.map(s => s.symbol === stock.symbol ? updatedStock : s))
  }

  const handleExportCSV = () => {
    const headers = ['Symbol', 'Name', 'Price', 'Change (%)']
    const csvContent = [
      headers.join(','),
      ...watchlist.map(stock => [
        stock.symbol,
        `"${stock.name}"`,
        stock.price.toFixed(2),
        stock.change.toFixed(2)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `watchlist_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <PixelatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-800"
              />
            </div>
          </div>

          {/* Watchlist Section */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                My Watchlist
              </CardTitle>
              {watchlist.length > 0 && (
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {watchlist.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  Your watchlist is empty. Add some stocks to track them!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {watchlist.map((stock) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{stock.symbol}</h3>
                          <p className="text-sm text-gray-400">{stock.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFromWatchlist(stock)}
                          className="text-yellow-500 hover:text-yellow-400"
                        >
                          <StarOff className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-bold">${stock.price.toFixed(2)}</p>
                        <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Stocks Section */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                Popular Stocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStocks
                  .filter(stock => popularStocks.some(p => p.symbol === stock.symbol))
                  .map((stock) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{stock.symbol}</h3>
                          <p className="text-sm text-gray-400">{stock.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => stock.isInWatchlist ? handleRemoveFromWatchlist(stock) : handleAddToWatchlist(stock)}
                          className={stock.isInWatchlist ? "text-yellow-500 hover:text-yellow-400" : "text-gray-400 hover:text-yellow-500"}
                        >
                          {stock.isInWatchlist ? <Star className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-bold">${stock.price.toFixed(2)}</p>
                        <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Stocks Section */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                Recommended Stocks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStocks
                  .filter(stock => recommendedStocks.some(r => r.symbol === stock.symbol))
                  .map((stock) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{stock.symbol}</h3>
                          <p className="text-sm text-gray-400">{stock.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => stock.isInWatchlist ? handleRemoveFromWatchlist(stock) : handleAddToWatchlist(stock)}
                          className={stock.isInWatchlist ? "text-yellow-500 hover:text-yellow-400" : "text-gray-400 hover:text-yellow-500"}
                        >
                          {stock.isInWatchlist ? <Star className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                        </Button>
                      </div>
                      <div className="mt-2">
                        <p className="text-lg font-bold">${stock.price.toFixed(2)}</p>
                        <p className={`text-sm ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 