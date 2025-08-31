"use client"

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import dynamic from "next/dynamic"

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false })

interface TechnicalIndicatorsProps {
  stockData: {
    date: string
    close: number
  }[]
  sma20: number
  rsi: number
  volatility: number
}

export function TechnicalIndicators({ stockData, sma20, rsi, volatility }: TechnicalIndicatorsProps) {
  const chartData = useMemo(() => {
    const dates = stockData.map(d => d.date)
    const prices = stockData.map(d => d.close)
    
    return [
      {
        x: dates,
        y: prices,
        type: 'scatter',
        mode: 'lines',
        name: 'Price',
        line: { color: '#3B82F6' }
      },
      {
        x: dates,
        y: Array(dates.length).fill(sma20),
        type: 'scatter',
        mode: 'lines',
        name: 'SMA20',
        line: { color: '#10B981', dash: 'dash' }
      }
    ]
  }, [stockData, sma20])

  const layout = {
    title: 'Technical Analysis',
    showlegend: true,
    xaxis: { title: 'Date', gridcolor: 'rgba(128,128,128,0.1)' },
    yaxis: { title: 'Price', gridcolor: 'rgba(128,128,128,0.1)' },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#fff' },
    autosize: true,
    height: 300,
    margin: { l: 50, r: 50, t: 30, b: 30 }
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Technical Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">SMA20</p>
            <p className="text-xl font-bold">{sma20.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">RSI</p>
            <p className="text-xl font-bold">{rsi.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">Volatility</p>
            <p className="text-xl font-bold">{(volatility * 100).toFixed(2)}%</p>
          </div>
        </div>
        <Plot
          data={chartData}
          layout={layout}
          config={{ responsive: true }}
          className="w-full h-[300px]"
        />
      </CardContent>
    </Card>
  )
}
