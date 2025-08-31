"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, AlertTriangle, BarChart2, Target, ArrowUpDown } from "lucide-react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface AIInsightsProps {
  stockData: {
    date: string
    open: number
    high: number
    low: number
    close: number
    volume: number
  }[]
  sma20: number
  rsi: number
  volatility: number
}

export function AIInsights({ stockData, sma20, rsi, volatility }: AIInsightsProps) {
  const insights = useMemo(() => {
    const latestPrice = stockData[stockData.length - 1].close
    const prevPrice = stockData[stockData.length - 2].close
    const priceChange = ((latestPrice - prevPrice) / prevPrice) * 100

    // Trend Analysis
    const trend = priceChange > 0 ? 'bullish' : 'bearish'
    const trendStrength = Math.abs(priceChange) > 2 ? 'strong' : 'weak'

    // RSI Analysis
    let rsiStrength = 'neutral'
    if (rsi > 70) rsiStrength = 'overbought'
    else if (rsi < 30) rsiStrength = 'oversold'

    // Volatility Analysis
    let riskLevel = 'medium'
    if (volatility > 0.7) riskLevel = 'high'
    else if (volatility < 0.3) riskLevel = 'low'

    // Volume Analysis
    const avgVolume = stockData.reduce((acc, curr) => acc + curr.volume, 0) / stockData.length
    const latestVolume = stockData[stockData.length - 1].volume
    const volumeRatio = latestVolume / avgVolume
    const volumeStrength = volumeRatio > 1.5 ? 'high' : volumeRatio > 1 ? 'moderate' : 'low'

    // Support/Resistance Analysis
    const recentHighs = stockData.slice(-20).map(d => d.high)
    const recentLows = stockData.slice(-20).map(d => d.low)
    const resistance = Math.max(...recentHighs)
    const support = Math.min(...recentLows)
    const distanceToResistance = ((resistance - latestPrice) / latestPrice) * 100
    const distanceToSupport = ((latestPrice - support) / latestPrice) * 100

    // Momentum Analysis
    const momentum = (latestPrice - stockData[stockData.length - 5].close) / stockData[stockData.length - 5].close * 100
    const momentumStrength = Math.abs(momentum) > 5 ? 'strong' : 'weak'

    return {
      trend,
      trendStrength,
      rsiStrength,
      riskLevel,
      volumeStrength,
      resistance,
      support,
      distanceToResistance,
      distanceToSupport,
      momentum,
      momentumStrength
    }
  }, [stockData, rsi, volatility])

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Trend Analysis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Trend</span>
              </div>
              <div className={`text-lg font-bold ${insights.trend === 'bullish' ? 'text-green-500' : 'text-red-500'}`}>
                {insights.trend.toUpperCase()} ({insights.trendStrength})
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                <span className="text-sm font-medium">Momentum</span>
              </div>
              <div className={`text-lg font-bold ${insights.momentum > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {insights.momentum.toFixed(2)}% ({insights.momentumStrength})
              </div>
            </div>
          </div>

          {/* RSI and Risk Analysis */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">RSI</span>
              </div>
              <div className={`text-lg font-bold ${
                insights.rsiStrength === 'overbought' ? 'text-red-500' :
                insights.rsiStrength === 'oversold' ? 'text-green-500' :
                'text-yellow-500'
              }`}>
                {rsi.toFixed(2)} ({insights.rsiStrength})
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Risk Level</span>
              </div>
              <div className={`text-lg font-bold ${
                insights.riskLevel === 'high' ? 'text-red-500' :
                insights.riskLevel === 'low' ? 'text-green-500' :
                'text-yellow-500'
              }`}>
                {insights.riskLevel.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Support/Resistance Levels */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <span className="text-sm font-medium">Key Levels</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-400">Resistance</div>
                <div className="text-lg font-bold">${insights.resistance.toFixed(2)}</div>
                <div className="text-sm text-gray-400">{insights.distanceToResistance.toFixed(2)}% above current</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Support</div>
                <div className="text-lg font-bold">${insights.support.toFixed(2)}</div>
                <div className="text-sm text-gray-400">{insights.distanceToSupport.toFixed(2)}% below current</div>
              </div>
            </div>
          </div>

          {/* Volume Analysis */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm font-medium">Volume Analysis</span>
            </div>
            <div className={`text-lg font-bold ${
              insights.volumeStrength === 'high' ? 'text-green-500' :
              insights.volumeStrength === 'moderate' ? 'text-yellow-500' :
              'text-red-500'
            }`}>
              {insights.volumeStrength.toUpperCase()} Volume
            </div>
          </div>

          {/* Volatility Gauge */}
          <div className="h-[100px]">
            <Plot
              data={[{
                type: 'indicator',
                mode: 'gauge+number',
                value: volatility * 100,
                title: { text: 'Volatility', font: { color: '#fff' } },
                gauge: {
                  axis: { range: [0, 100], tickwidth: 1, tickcolor: '#fff' },
                  bar: { color: '#3B82F6' },
                  bgcolor: 'rgba(0,0,0,0)',
                  borderwidth: 2,
                  bordercolor: 'rgba(255,255,255,0.1)',
                  steps: [
                    { range: [0, 30], color: '#10B981' },
                    { range: [30, 70], color: '#F59E0B' },
                    { range: [70, 100], color: '#EF4444' }
                  ]
                }
              }]}
              layout={{
                height: 100,
                margin: { t: 20, b: 20, l: 20, r: 20 },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: '#fff' }
              }}
              config={{ responsive: true, displayModeBar: false }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
