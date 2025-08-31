"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, BarChart2, HelpCircle, Bell, Shield, CreditCard } from "lucide-react"
import { motion } from "framer-motion"
import PixelatedBackground from "@/components/pixelated-background"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    marketNews: true,
    watchlistUpdates: true,
  })

  const handleNotificationChange = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof notifications]
    }))
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <PixelatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
            Settings
          </h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <BarChart2 className="h-4 w-4" />
                Stock Preferences
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Username</Label>
                      <Input value="trader123" disabled className="bg-gray-800/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input value="trader123@example.com" disabled className="bg-gray-800/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Account Type</Label>
                      <Input value="Premium" disabled className="bg-gray-800/50" />
                    </div>
                    <div className="space-y-2">
                      <Label>Member Since</Label>
                      <Input value="January 2024" disabled className="bg-gray-800/50" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-yellow-500" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Price Alerts</h3>
                        <p className="text-sm text-gray-400">Get notified when stocks reach your target prices</p>
                      </div>
                      <Button
                        variant={notifications.priceAlerts ? "default" : "outline"}
                        onClick={() => handleNotificationChange("priceAlerts")}
                        className={notifications.priceAlerts ? "bg-emerald-500" : ""}
                      >
                        {notifications.priceAlerts ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Market News</h3>
                        <p className="text-sm text-gray-400">Receive updates about market trends and news</p>
                      </div>
                      <Button
                        variant={notifications.marketNews ? "default" : "outline"}
                        onClick={() => handleNotificationChange("marketNews")}
                        className={notifications.marketNews ? "bg-emerald-500" : ""}
                      >
                        {notifications.marketNews ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Watchlist Updates</h3>
                        <p className="text-sm text-gray-400">Get notified about changes in your watchlist stocks</p>
                      </div>
                      <Button
                        variant={notifications.watchlistUpdates ? "default" : "outline"}
                        onClick={() => handleNotificationChange("watchlistUpdates")}
                        className={notifications.watchlistUpdates ? "bg-emerald-500" : ""}
                      >
                        {notifications.watchlistUpdates ? "Enabled" : "Disabled"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart2 className="h-5 w-5 text-emerald-500" />
                    Stock Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Default Timeframe</h3>
                      <p className="text-sm text-gray-400">1D (Daily)</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Preferred Market</h3>
                      <p className="text-sm text-gray-400">US Stock Market</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Chart Type</h3>
                      <p className="text-sm text-gray-400">Candlestick</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Technical Indicators</h3>
                      <p className="text-sm text-gray-400">SMA, RSI, MACD</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-blue-500" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">How do I add stocks to my watchlist?</h3>
                      <p className="text-sm text-gray-400">Click the star icon next to any stock to add it to your watchlist. You can also search for stocks and add them from the search results.</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">What do the technical indicators mean?</h3>
                      <p className="text-sm text-gray-400">Technical indicators help analyze stock price movements. SMA shows average prices, RSI indicates overbought/oversold conditions, and MACD shows trend direction.</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">How often is the data updated?</h3>
                      <p className="text-sm text-gray-400">Stock prices are updated in real-time during market hours. Technical indicators are recalculated every 15 minutes.</p>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="font-medium mb-2">Can I set price alerts?</h3>
                      <p className="text-sm text-gray-400">Yes, you can set price alerts for any stock in your watchlist. Go to the stock's page and click the bell icon to set up alerts.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 