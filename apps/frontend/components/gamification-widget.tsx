"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, Flame, Gift } from "lucide-react"
import Link from "next/link"

interface GamificationWidgetProps {
  userLevel?: number
  currentXP?: number
  nextLevelXP?: number
  totalPoints?: number
  streak?: number
  recentAchievement?: {
    name: string
    icon: string
    points: number
  }
}

export function GamificationWidget({
  userLevel = 3,
  currentXP = 2450,
  nextLevelXP = 3000,
  totalPoints = 8750,
  streak = 12,
  recentAchievement,
}: GamificationWidgetProps) {
  const progressPercent = (currentXP / nextLevelXP) * 100

  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Trophy className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold">Level {userLevel}</h3>
              <p className="text-sm text-muted-foreground">{totalPoints.toLocaleString()} points</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">{streak} day streak</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span>Progress to Level {userLevel + 1}</span>
            <span>
              {currentXP}/{nextLevelXP} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {recentAchievement && (
          <div className="p-3 bg-accent/10 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">{recentAchievement.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">New Achievement!</p>
                <p className="text-xs text-muted-foreground">{recentAchievement.name}</p>
              </div>
              <Badge variant="secondary">+{recentAchievement.points}</Badge>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/rewards">
              <Gift className="h-4 w-4 mr-2" />
              Rewards
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
            <Link href="/rewards?tab=achievements">
              <Star className="h-4 w-4 mr-2" />
              Achievements
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
