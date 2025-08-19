"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Bot, User, TrendingUp, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

interface Message {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
  recommendations?: CarRecommendation[]
  quickReplies?: string[]
}

interface ChatMessageProps {
  message: Message
  onQuickReply?: (reply: string) => void
}

export function ChatMessage({ message, onQuickReply }: ChatMessageProps) {
  return (
    <div className={`flex gap-3 ${message.type === "user" ? "justify-end" : ""}`}>
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
            message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-muted text-muted-foreground"
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
        {message.quickReplies && onQuickReply && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => onQuickReply(reply)}
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
  )
}
