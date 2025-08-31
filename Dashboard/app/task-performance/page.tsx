"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PixelatedBackground from "@/components/pixelated-background"
import { Search, LineChart, CandlestickChart, TrendingUp, Activity, Gauge, BarChart3, ArrowUpDown, Target, ArrowDownUp } from "lucide-react"
import dynamic from "next/dynamic"
import { TechnicalIndicators } from "@/components/stock-analysis/technical-indicators"
import { AIInsights } from "@/components/stock-analysis/ai-insights"

// Import Plot component with proper typing
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false }) as React.ComponentType<{
  data: any[];
  layout: any;
  config?: any;
  className?: string;
}>

interface StockData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

interface ForecastData {
  date: string
  yhat: number
  yhat_lower: number
  yhat_upper: number
}

export default function TaskPerformancePage() {
  const [symbol, setSymbol] = useState("AAPL") // Default to AAPL
  const [stockData, setStockData] = useState<StockData[]>([])
  const [forecastData, setForecastData] = useState<ForecastData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [change24h, setChange24h] = useState<number | null>(null)
  const [volume, setVolume] = useState<number | null>(null)
  const [sma20, setSma20] = useState<number | null>(null)
  const [rsi, setRsi] = useState<number | null>(null)
  const [volatility, setVolatility] = useState<number | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    fetchStockData()
  }, [])

  const fetchStockData = async () => {
    if (!symbol) return
    setLoading(true)
    setError("")
    try {
      // Fetch stock data
      const response = await fetch(`/api/stock/${symbol}`)
      if (!response.ok) throw new Error("Failed to fetch stock data")
      const data = await response.json()
      
      // Update state with real-time data
      setStockData(data.data)
      setCurrentPrice(data.currentPrice)
      setChange24h(data.change24h)
      setVolume(data.volume)
      setSma20(data.sma20)
      setRsi(data.rsi)
      setVolatility(data.volatility)

      // Fetch forecast data
      const forecastResponse = await fetch(`/api/forecast/${symbol}`)
      if (!forecastResponse.ok) throw new Error("Failed to fetch forecast data")
      const forecast = await forecastResponse.json()
      setForecastData(forecast)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchStockData()
  }

  // Chart data configurations
  const candlestickData = {
    x: stockData.slice(-30).map(d => d.date),
    open: stockData.slice(-30).map(d => d.open),
    high: stockData.slice(-30).map(d => d.high),
    low: stockData.slice(-30).map(d => d.low),
    close: stockData.slice(-30).map(d => d.close),
    type: 'candlestick',
    name: symbol,
    increasing: { 
      line: { color: '#26a69a' },
      fillcolor: '#26a69a'
    },
    decreasing: { 
      line: { color: '#ef5350' },
      fillcolor: '#ef5350'
    },
    whiskerwidth: 0.5,
    width: 0.6
  }

  const ohlcData = {
    x: stockData.slice(-30).map(d => d.date),
    open: stockData.slice(-30).map(d => d.open),
    high: stockData.slice(-30).map(d => d.high),
    low: stockData.slice(-30).map(d => d.low),
    close: stockData.slice(-30).map(d => d.close),
    type: 'ohlc',
    name: symbol,
    increasing: { 
      line: { color: '#26a69a' }
    },
    decreasing: { 
      line: { color: '#ef5350' }
    }
  }

  const timeSeriesData = {
    x: stockData.slice(-30).map(d => d.date),
    y: stockData.slice(-30).map(d => d.close),
    type: 'scatter',
    mode: 'lines',
    name: 'Closing Price',
    line: { 
      color: '#3B82F6',
      width: 2
    }
  }

  const volumeData = {
    x: stockData.slice(-30).map(d => d.date),
    y: stockData.slice(-30).map(d => d.volume),
    type: 'bar',
    name: 'Volume',
    marker: { 
      color: '#6B7280',
      opacity: 0.7
    }
  }

  const waterfallData = {
    type: 'waterfall',
    x: stockData.slice(-10).map(d => d.date),
    y: stockData.slice(-10).map(d => d.close - d.open),
    text: stockData.slice(-10).map(d => `$${(d.close - d.open).toFixed(2)}`),
    connector: { line: { color: 'rgba(255,255,255,0.1)' } },
    increasing: { marker: { color: '#10B981' } },
    decreasing: { marker: { color: '#EF4444' } }
  }

  const funnelData = {
    type: 'funnel',
    y: ['High', 'Open', 'Close', 'Low'],
    x: stockData.length > 0 ? [
      Math.max(...stockData.map(d => d.high)),
      stockData[stockData.length - 1].open,
      stockData[stockData.length - 1].close,
      Math.min(...stockData.map(d => d.low))
    ] : [0, 0, 0, 0],
    textinfo: 'value+percent initial',
    marker: {
      colors: ['#3B82F6', '#10B981', '#EF4444', '#6B7280']
    }
  }

  const gaugeData = {
    type: 'indicator',
    mode: 'gauge+number',
    value: currentPrice || 0,
    title: { text: 'Current Price' },
    gauge: {
      axis: { 
        range: [
          Math.min(...stockData.map(d => d.low)),
          Math.max(...stockData.map(d => d.high))
        ]
      },
      bar: { color: '#3B82F6' },
      steps: [
        { range: [0, 100], color: '#1F2937' },
        { range: [100, 200], color: '#374151' }
      ]
    }
  }

  const bulletData = {
    type: 'indicator',
    mode: 'number+gauge',
    value: currentPrice || 0,
    delta: { 
      reference: stockData.length > 1 ? stockData[stockData.length - 2].close : 0,
      increasing: { color: '#10B981' },
      decreasing: { color: '#EF4444' }
    },
    gauge: {
      shape: 'bullet',
      axis: { 
        range: [
          Math.min(...stockData.map(d => d.low)),
          Math.max(...stockData.map(d => d.high))
        ]
      },
      bar: { color: '#3B82F6' },
      steps: [
        { range: [0, 100], color: '#1F2937' },
        { range: [100, 200], color: '#374151' }
      ]
    }
  }

  const indicatorsData = {
    x: stockData.map(d => d.date),
    y: stockData.map(d => (d.close - d.open) / d.open * 100),
    type: 'scatter',
    mode: 'lines',
    name: 'Daily Change %',
    line: { color: '#8B5CF6' }
  }

  // Update the chart components to use proper typing
  const ChartCard = ({ title, icon: Icon, data, layout }: { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>; 
    data: any[]; 
    layout: any;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <Plot
              data={data}
              layout={{
                ...layout,
                autosize: true,
                margin: { l: 40, r: 40, t: 40, b: 40 },
              }}
              config={{ responsive: true }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-4">
      <PixelatedBackground />
      
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <Input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol..."
          className="max-w-xs"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </Button>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {stockData.length > 0 && (
        <div className="space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Current Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${currentPrice?.toFixed(2)}
                </div>
                <p className={`text-sm ${change24h && change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {change24h?.toFixed(2)}% 24h
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {volume?.toLocaleString()}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">RSI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {rsi?.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Volatility</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(volatility || 0 * 100).toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Charts Section */}
          <div className="space-y-4">
            {/* Price Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Price Chart</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="candlestick">
                  <TabsList className="mb-4">
                    <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
                    <TabsTrigger value="ohlc">OHLC</TabsTrigger>
                    <TabsTrigger value="line">Line</TabsTrigger>
                  </TabsList>
                  <div className="h-[600px] w-full">
                    <TabsContent value="candlestick" className="h-full">
                      <Plot
                        data={[candlestickData]}
                        layout={{
                          autosize: true,
                          height: 600,
                          width: undefined,
                          margin: { l: 60, r: 40, t: 40, b: 60 },
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          xaxis: { 
                            gridcolor: 'rgba(128,128,128,0.1)',
                            tickangle: 45,
                            tickformat: '%b %d',
                            showgrid: true,
                            zeroline: false,
                            automargin: true
                          },
                          yaxis: { 
                            gridcolor: 'rgba(128,128,128,0.1)',
                            tickprefix: '$',
                            tickformat: '.2f',
                            showgrid: true,
                            zeroline: false,
                            automargin: true
                          },
                          font: { color: '#fff' },
                          showlegend: false,
                          dragmode: 'pan',
                          hovermode: 'x unified'
                        }}
                        config={{ 
                          responsive: true,
                          displayModeBar: true,
                          displaylogo: false,
                          modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                          scrollZoom: true
                        }}
                        className="w-full h-full"
                      />
                    </TabsContent>
                    <TabsContent value="ohlc" className="h-full">
                      <Plot
                        data={[ohlcData]}
                        layout={{
                          autosize: true,
                          height: 600,
                          width: undefined,
                          margin: { l: 60, r: 40, t: 40, b: 60 },
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          xaxis: { 
                            gridcolor: 'rgba(128,128,128,0.1)',
                            tickangle: 45,
                            tickformat: '%b %d',
                            showgrid: true,
                            zeroline: false,
                            automargin: true
                          },
                          yaxis: { 
                            gridcolor: 'rgba(128,128,128,0.1)',
                            tickprefix: '$',
                            tickformat: '.2f',
                            showgrid: true,
                            zeroline: false,
                            automargin: true
                          },
                          font: { color: '#fff' },
                          showlegend: false,
                          dragmode: 'pan',
                          hovermode: 'x unified'
                        }}
                        config={{ 
                          responsive: true,
                          displayModeBar: true,
                          displaylogo: false,
                          modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                          scrollZoom: true
                        }}
                        className="w-full h-full"
                      />
                    </TabsContent>
                    <TabsContent value="line" className="h-full">
                      <Plot
                        data={[timeSeriesData]}
                        layout={{
                          autosize: true,
                          height: 600,
                          width: undefined,
                          margin: { l: 60, r: 40, t: 40, b: 60 },
                          plot_bgcolor: 'rgba(0,0,0,0)',
                          paper_bgcolor: 'rgba(0,0,0,0)',
                          xaxis: { 
                            gridcolor: 'rgba(128,128,128,0.1)',
                            tickangle: 45,
                            tickformat: '%b %d',
                            showgrid: true,
                            zeroline: false,
                            automargin: true
                          },
                          yaxis: { 
                            gridcolor: 'rgba(128,128,128,0.1)',
                            tickprefix: '$',
                            tickformat: '.2f',
                            showgrid: true,
                            zeroline: false,
                            automargin: true
                          },
                          font: { color: '#fff' },
                          showlegend: false,
                          dragmode: 'pan',
                          hovermode: 'x unified'
                        }}
                        config={{ 
                          responsive: true,
                          displayModeBar: true,
                          displaylogo: false,
                          modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                          scrollZoom: true
                        }}
                        className="w-full h-full"
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>

            {/* Volume Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Volume Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <Plot
                    data={[volumeData]}
                    layout={{
                      autosize: true,
                      height: 600,
                      width: undefined,
                      margin: { l: 60, r: 40, t: 40, b: 60 },
                      plot_bgcolor: 'rgba(0,0,0,0)',
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      xaxis: { 
                        gridcolor: 'rgba(128,128,128,0.1)',
                        tickangle: 45,
                        tickformat: '%b %d',
                        showgrid: true,
                        zeroline: false,
                        automargin: true,
                        title: {
                          text: 'Date',
                          font: { color: '#fff' }
                        }
                      },
                      yaxis: { 
                        gridcolor: 'rgba(128,128,128,0.1)',
                        tickformat: '.2s',
                        showgrid: true,
                        zeroline: false,
                        automargin: true,
                        title: {
                          text: 'Volume',
                          font: { color: '#fff' }
                        }
                      },
                      font: { color: '#fff' },
                      showlegend: false,
                      dragmode: 'pan',
                      hovermode: 'x unified',
                      bargap: 0.1,
                      bargroupgap: 0.1,
                      barmode: 'group',
                      bargap: 0.15,
                      bargroupgap: 0.1
                    }}
                    config={{ 
                      responsive: true,
                      displayModeBar: true,
                      displaylogo: false,
                      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                      scrollZoom: true
                    }}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Price Change Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Price Change Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] w-full">
                  <Plot
                    data={[waterfallData]}
                    layout={{
                      autosize: true,
                      height: 600,
                      width: undefined,
                      margin: { l: 60, r: 40, t: 40, b: 60 },
                      plot_bgcolor: 'rgba(0,0,0,0)',
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      xaxis: { 
                        gridcolor: 'rgba(128,128,128,0.1)',
                        tickangle: 45,
                        tickformat: '%b %d',
                        showgrid: true,
                        zeroline: false,
                        automargin: true
                      },
                      yaxis: { 
                        gridcolor: 'rgba(128,128,128,0.1)',
                        tickprefix: '$',
                        tickformat: '.2f',
                        showgrid: true,
                        zeroline: false,
                        automargin: true
                      },
                      font: { color: '#fff' },
                      showlegend: false,
                      dragmode: 'pan',
                      hovermode: 'x unified'
                    }}
                    config={{ 
                      responsive: true,
                      displayModeBar: true,
                      displaylogo: false,
                      modeBarButtonsToRemove: ['lasso2d', 'select2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
                      scrollZoom: true
                    }}
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Technical Indicators */}
            <TechnicalIndicators
              stockData={stockData}
              sma20={sma20 || 0}
              rsi={rsi || 0}
              volatility={volatility || 0}
            />

            {/* AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AIInsights
                stockData={stockData}
                sma20={sma20 || 0}
                rsi={rsi || 0}
                volatility={volatility || 0}
              />

              {/* Volume Analysis Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Volume Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    <Plot
                      data={[{
                        type: 'pie',
                        labels: ['Buy Volume', 'Sell Volume'],
                        values: [
                          stockData.reduce((acc, curr) => acc + (curr.close > curr.open ? curr.volume : 0), 0),
                          stockData.reduce((acc, curr) => acc + (curr.close < curr.open ? curr.volume : 0), 0)
                        ],
                        marker: {
                          colors: ['#10B981', '#EF4444']
                        },
                        textinfo: 'label+percent',
                        hole: 0.4,
                        pull: 0.1
                      }]}
                      layout={{
                        autosize: true,
                        height: 300,
                        width: undefined,
                        margin: { l: 20, r: 20, t: 20, b: 20 },
                        plot_bgcolor: 'rgba(0,0,0,0)',
                        paper_bgcolor: 'rgba(0,0,0,0)',
                        font: { color: '#fff' },
                        showlegend: true,
                        legend: {
                          orientation: 'h',
                          y: -0.1
                        }
                      }}
                      config={{ 
                        responsive: true,
                        displayModeBar: false
                      }}
                      className="w-full h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 