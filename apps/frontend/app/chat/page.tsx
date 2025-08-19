"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Bot, User, Sparkles, Eye, MessageSquare, Zap, TrendingUp, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScoutIcon } from "@/components/scout-icon"

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  recommendations?: CarRecommendation[]
  quickReplies?: string[]
}

interface CarRecommendation {
  id: number
  make: string
  model: string
  year: number
  price: number
  image: string
  matchScore: number
  reasons: string[]
  highlights: string[]
}

const mockRecommendations: CarRecommendation[] = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry Hybrid",
    year: 2024,
    price: 28500,
    image: "/toyota-camry-2024.png",
    matchScore: 95,
    reasons: ["Excellent fuel economy", "Reliable brand", "Within budget", "Great safety ratings"],
    highlights: ["32/41 MPG", "Toyota Safety Sense 2.0", "Spacious interior"],
  },
  {
    id: 2,
    make: "Honda",
    model: "Accord",
    year: 2023,
    price: 26800,
    image: "/honda-accord-2023.png",
    matchScore: 92,
    reasons: ["Proven reliability", "Comfortable ride", "Good resale value", "Advanced tech features"],
    highlights: ["Honda Sensing", "Wireless charging", "Premium audio"],
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    price: 42990,
    image: "/tesla-model-3-2024.png",
    matchScore: 88,
    reasons: ["Zero emissions", "Cutting-edge technology", "Low maintenance", "Autopilot features"],
    highlights: ["134 MPGe", "Supercharging network", "Over-the-air updates"],
  },
]

const initialMessages: Message[] = [
  {
    id: "1",
    type: "ai",
    content:
      "Hello! I'm Scout AI, your personal vehicle recommendation assistant. I'll help you find the perfect car based on your needs, preferences, and lifestyle. Let's start with a few questions to understand what you're looking for.",
    timestamp: new Date(),
    quickReplies: [
      "I'm looking for my first car",
      "I need a family vehicle",
      "I want something fuel efficient",
      "Show me luxury options",
    ],
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase()

    // Simulate different conversation flows
    if (lowerMessage.includes("first car") || lowerMessage.includes("new driver")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "Great choice for your first car! I'd recommend focusing on reliability, safety, and affordability. What's your budget range, and will you primarily use it for commuting or general driving?",
        timestamp: new Date(),
        quickReplies: ["Under $25,000", "$25,000 - $35,000", "Mostly commuting", "Weekend trips too"],
      }
    }

    if (lowerMessage.includes("family") || lowerMessage.includes("kids")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "Perfect! For families, I focus on safety ratings, space, and reliability. How many people do you need to seat regularly, and do you prefer an SUV, minivan, or large sedan?",
        timestamp: new Date(),
        quickReplies: ["5 people", "7+ people", "I prefer SUVs", "Sedan is fine"],
      }
    }

    if (lowerMessage.includes("fuel") || lowerMessage.includes("efficient") || lowerMessage.includes("gas")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "Excellent priority! Fuel efficiency can save you thousands per year. Based on your preferences, here are my top recommendations for fuel-efficient vehicles:",
        timestamp: new Date(),
        recommendations: mockRecommendations,
        quickReplies: ["Tell me more about hybrids", "What about electric cars?", "Show me more options"],
      }
    }

    if (lowerMessage.includes("luxury") || lowerMessage.includes("premium")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "I understand you're looking for premium features and luxury. What aspects of luxury are most important to you - performance, comfort, technology, or brand prestige?",
        timestamp: new Date(),
        quickReplies: ["Performance focused", "Maximum comfort", "Latest technology", "Brand reputation"],
      }
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("$")) {
      return {
        id: Date.now().toString(),
        type: "ai",
        content:
          "Thanks for sharing your budget! That helps me narrow down the options significantly. What type of vehicle are you most interested in, and what features are must-haves versus nice-to-haves?",
        timestamp: new Date(),
        quickReplies: ["Sedan", "SUV", "Truck", "Hatchback", "Safety is priority", "Tech features important"],
      }
    }

    // Default response with recommendations
    return {
      id: Date.now().toString(),
      type: "ai",
      content:
        "Based on our conversation, I've analyzed your preferences and found some excellent matches. Here are my personalized recommendations:",
      timestamp: new Date(),
      recommendations: mockRecommendations,
      quickReplies: ["Why these cars?", "Show me more options", "What about financing?", "Schedule test drives"],
    }
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = generateAIResponse(content)
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <ScoutIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Scout</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Recommendations
              </Badge>
              <Button variant="outline" asChild>
                <Link href="/browse">Browse Cars</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-card rounded-lg border border-border h-[calc(100vh-200px)] flex flex-col">
          {/* Chat Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 bg-accent">
                <AvatarFallback>
                  <Bot className="h-5 w-5 text-accent-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">Scout AI Assistant</h2>
                <p className="text-sm text-muted-foreground">Your personal vehicle recommendation expert</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
                  {message.type === "ai" && (
                    <Avatar className="h-8 w-8 bg-accent flex-shrink-0">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-accent-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div className={`max-w-[80%] ${message.type === "user" ? "order-first" : ""}`}>
                    <div
                      className={`rounded-lg p-4 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground ml-auto"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>

                    {/* Car Recommendations */}
                    {message.recommendations && (
                      <div className="mt-4 space-y-3">
                        {message.recommendations.map((car) => (
                          <Card key={car.id} className="border-border hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex gap-4">
                                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={car.image || "/placeholder.svg"}
                                    alt={`${car.year} ${car.make} ${car.model}`}
                                    width={96}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h4 className="font-semibold text-sm">
                                        {car.year} {car.make} {car.model}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">${car.price.toLocaleString()}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      {car.matchScore}% match
                                    </Badge>
                                  </div>

                                  <div className="flex flex-wrap gap-1 mb-3">
                                    {car.highlights.map((highlight, index) => (
                                      <Badge key={index} variant="outline" className="text-xs">
                                        {highlight}
                                      </Badge>
                                    ))}
                                  </div>

                                  <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className="text-xs bg-transparent" asChild>
                                      <Link href={`/browse/${car.id}`}>
                                        <Eye className="h-3 w-3 mr-1" />
                                        View Details
                                      </Link>
                                    </Button>
                                    <Button size="sm" variant="outline" className="text-xs bg-transparent" asChild>
                                      <Link href={`/schedule?car=${car.id}`}>Test Drive</Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Quick Replies */}
                    {message.quickReplies && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-xs bg-transparent"
                            onClick={() => handleQuickReply(reply)}
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>

                  {message.type === "user" && (
                    <Avatar className="h-8 w-8 bg-primary flex-shrink-0">
                      <AvatarFallback>
                        <User className="h-4 w-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 bg-accent flex-shrink-0">
                    <AvatarFallback>
                      <Bot className="h-4 w-4 text-accent-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me about your ideal car..."
                className="flex-1 bg-input border-border"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Scout AI uses advanced algorithms to match you with the perfect vehicle
            </p>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-border bg-card/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Secure & Private</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Instant Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Expert Knowledge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
