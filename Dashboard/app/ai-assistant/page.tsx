"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, Bot, User, Sparkles, Brain, MessageSquare, BarChart3, TrendingUp, AlertTriangle } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import PixelatedBackground from "@/components/pixelated-background"
import { getGeminiResponse, analyzeStock, getMarketInsights } from "@/lib/gemini"

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'analysis' | 'insight' | 'general'
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        role: 'user',
        content: input,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      setInput("")
      setIsTyping(true)

      try {
        let response: string
        let messageType: 'analysis' | 'insight' | 'general' = 'general'

        // Check if the message is about a specific stock
        const stockMatch = input.match(/analyze\s+(\w+)/i)
        if (stockMatch) {
          const symbol = stockMatch[1].toUpperCase()
          response = await analyzeStock(symbol)
          messageType = 'analysis'
        } 
        // Check if the message is about market insights
        else if (input.toLowerCase().includes('market') || 
                 input.toLowerCase().includes('overview') || 
                 input.toLowerCase().includes('trends')) {
          response = await getMarketInsights()
          messageType = 'insight'
        } 
        // General question
        else {
          const context = "You are an AI stock market assistant. Provide short, accurate information about stocks, trading, and market analysis. every time you should ask questions about stock market and also strictly give response in simple  one or two sentences no special thingss"
          response = await getGeminiResponse(input, context)
        }

        const aiResponse: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          type: messageType
        }
        setMessages(prev => [...prev, aiResponse])
      } catch (error) {
        console.error("Error processing message:", error)
        const errorResponse: Message = {
          role: 'assistant',
          content: "I apologize, but I'm having trouble processing your request. Please try again later.",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorResponse])
      } finally {
        setIsTyping(false)
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <PixelatedBackground />
      
      <div className="relative z-10">
        <main className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1 space-y-4"
            >
              <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-emerald-500" />
                    Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="h-4 w-4 text-emerald-500" />
                      <span>Stock Analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span>Market Trends</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-emerald-500" />
                      <span>Risk Assessment</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-500" />
                    Recent Chats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-400">No recent chats</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Main Chat Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <Card className="bg-gray-900/60 border-gray-800 backdrop-blur-sm h-[calc(100vh-8rem)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-emerald-500" />
                    AI Stock Market Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col h-[calc(100%-4rem)]">
                  <div className="flex-1 overflow-y-auto space-y-4 p-4">
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-emerald-600/80 text-white'
                              : 'bg-gray-800/80 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {message.role === 'user' ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        </div>
                      </motion.div>
                    ))}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-gray-400"
                      >
                        <Bot className="h-4 w-4" />
                        <span>AI is analyzing</span>
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about stocks... (e.g., 'analyze AAPL' or 'market overview')"
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      className="bg-gray-800/80 border-gray-700 focus:ring-emerald-500"
                    />
                    <Button 
                      onClick={handleSend}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
} 