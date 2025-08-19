"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Car,
  ArrowLeft,
  Trophy,
  Star,
  Target,
  Gift,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Clock,
  Flame,
} from "lucide-react"
import Link from "next/link"

// Mock gamification data
const userProgress = {
  level: 3,
  currentXP: 2450,
  nextLevelXP: 3000,
  totalPoints: 8750,
  streak: 12,
  rank: "Silver Explorer",
}

const achievements = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your profile and preferences",
    icon: "👤",
    category: "Getting Started",
    points: 100,
    earned: true,
    earnedDate: "2024-03-15",
    progress: 100,
    maxProgress: 100,
  },
  {
    id: 2,
    name: "Chat Master",
    description: "Have 5 conversations with Scout AI",
    icon: "💬",
    category: "Engagement",
    points: 250,
    earned: true,
    earnedDate: "2024-03-20",
    progress: 100,
    maxProgress: 100,
  },
  {
    id: 3,
    name: "Test Drive Pro",
    description: "Schedule and complete 3 test drives",
    icon: "🚗",
    category: "Experience",
    points: 500,
    earned: true,
    earnedDate: "2024-04-01",
    progress: 100,
    maxProgress: 100,
  },
  {
    id: 4,
    name: "Maintenance Master",
    description: "Keep up with all scheduled services for 6 months",
    icon: "🔧",
    category: "Ownership",
    points: 750,
    earned: true,
    earnedDate: "2024-04-10",
    progress: 100,
    maxProgress: 100,
  },
  {
    id: 5,
    name: "Explorer",
    description: "Browse and save 10 different vehicles",
    icon: "🔍",
    category: "Discovery",
    points: 300,
    earned: false,
    progress: 7,
    maxProgress: 10,
  },
  {
    id: 6,
    name: "Referral Champion",
    description: "Refer 5 friends to Scout",
    icon: "👥",
    category: "Community",
    points: 1000,
    earned: false,
    progress: 2,
    maxProgress: 5,
  },
  {
    id: 7,
    name: "Trade-In Expert",
    description: "Complete your first vehicle trade-in",
    icon: "💰",
    category: "Transactions",
    points: 1500,
    earned: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 8,
    name: "Loyalty Legend",
    description: "Use Scout for 1 full year",
    icon: "⭐",
    category: "Loyalty",
    points: 2000,
    earned: false,
    progress: 3,
    maxProgress: 12,
  },
]

const challenges = [
  {
    id: 1,
    name: "Weekly Explorer",
    description: "Browse 5 new vehicles this week",
    timeLeft: "3 days",
    progress: 3,
    maxProgress: 5,
    reward: "150 points",
    type: "weekly",
  },
  {
    id: 2,
    name: "Service Streak",
    description: "Maintain your service schedule for 30 days",
    timeLeft: "18 days",
    progress: 12,
    maxProgress: 30,
    reward: "500 points + Badge",
    type: "monthly",
  },
  {
    id: 3,
    name: "AI Conversation",
    description: "Have a meaningful chat with Scout AI",
    timeLeft: "6 days",
    progress: 0,
    maxProgress: 1,
    reward: "100 points",
    type: "weekly",
  },
]

const rewards = [
  {
    id: 1,
    name: "Free Car Wash",
    description: "Complimentary premium car wash at participating locations",
    cost: 500,
    category: "Service",
    available: true,
    icon: "🚿",
  },
  {
    id: 2,
    name: "Priority Scheduling",
    description: "Skip the line and get priority appointment booking",
    cost: 750,
    category: "Premium",
    available: true,
    icon: "⚡",
  },
  {
    id: 3,
    name: "Extended Test Drive",
    description: "24-hour test drive for any vehicle",
    cost: 1000,
    category: "Experience",
    available: true,
    icon: "🗓️",
  },
  {
    id: 4,
    name: "VIP Consultation",
    description: "One-on-one session with our top automotive expert",
    cost: 1500,
    category: "Premium",
    available: true,
    icon: "👨‍💼",
  },
  {
    id: 5,
    name: "Trade-In Bonus",
    description: "$500 bonus on your next trade-in value",
    cost: 2000,
    category: "Financial",
    available: false,
    icon: "💵",
  },
  {
    id: 6,
    name: "Exclusive Preview",
    description: "First access to new vehicle arrivals",
    cost: 2500,
    category: "Exclusive",
    available: true,
    icon: "🎯",
  },
]

const leaderboard = [
  { rank: 1, name: "Sarah M.", points: 12450, level: 5, badge: "Gold Pioneer" },
  { rank: 2, name: "Mike R.", points: 11200, level: 4, badge: "Silver Explorer" },
  { rank: 3, name: "You", points: 8750, level: 3, badge: "Silver Explorer" },
  { rank: 4, name: "Lisa K.", points: 8100, level: 3, badge: "Bronze Adventurer" },
  { rank: 5, name: "David L.", points: 7850, level: 3, badge: "Bronze Adventurer" },
]

export default function RewardsPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const earnedAchievements = achievements.filter((a) => a.earned)
  const inProgressAchievements = achievements.filter((a) => !a.earned)
  const categories = ["all", ...Array.from(new Set(achievements.map((a) => a.category)))]

  const filteredAchievements =
    selectedCategory === "all" ? achievements : achievements.filter((a) => a.category === selectedCategory)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <Car className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Scout</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{userProgress.totalPoints.toLocaleString()} Points</p>
                <p className="text-xs text-muted-foreground">
                  Level {userProgress.level} • {userProgress.rank}
                </p>
              </div>
              <Avatar className="h-10 w-10 bg-accent">
                <AvatarFallback className="text-accent-foreground font-semibold">{userProgress.level}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Rewards & Achievements</h1>
          <p className="text-muted-foreground">
            Earn points, unlock achievements, and redeem exclusive rewards for your automotive journey.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Level</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">Level {userProgress.level}</div>
                      <div className="text-sm text-muted-foreground">{userProgress.rank}</div>
                    </div>
                    <Trophy className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {userProgress.totalPoints.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">+450 this week</div>
                    </div>
                    <Star className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{userProgress.streak} days</div>
                      <div className="text-sm text-muted-foreground">Keep it up!</div>
                    </div>
                    <Flame className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        {earnedAchievements.length}/{achievements.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Unlocked</div>
                    </div>
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Level Progress */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Level Progress
                </CardTitle>
                <CardDescription>
                  {userProgress.nextLevelXP - userProgress.currentXP} XP needed to reach Level {userProgress.level + 1}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Level {userProgress.level}</span>
                    <span className="text-sm font-medium">Level {userProgress.level + 1}</span>
                  </div>
                  <Progress value={(userProgress.currentXP / userProgress.nextLevelXP) * 100} className="h-3" />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{userProgress.currentXP} XP</span>
                    <span>{userProgress.nextLevelXP} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {earnedAchievements.slice(-3).map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-4 p-3 bg-accent/10 rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{achievement.name}</h4>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">+{achievement.points} pts</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.earnedDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory !== category ? "bg-transparent" : ""}
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`border transition-all ${
                    achievement.earned ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{achievement.name}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {achievement.category}
                          </Badge>
                        </div>
                      </div>
                      {achievement.earned && <CheckCircle className="h-5 w-5 text-green-600" />}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>

                    {!achievement.earned && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {achievement.progress}/{achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">+{achievement.points} points</Badge>
                      {achievement.earned && (
                        <span className="text-xs text-muted-foreground">Earned {achievement.earnedDate}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Active Challenges
                </CardTitle>
                <CardDescription>Complete these challenges to earn bonus points and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {challenges.map((challenge) => (
                    <Card key={challenge.id} className="border-border">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="font-semibold text-lg">{challenge.name}</h4>
                            <p className="text-muted-foreground">{challenge.description}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant={challenge.type === "weekly" ? "default" : "secondary"} className="mb-2">
                              {challenge.type}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {challenge.timeLeft} left
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {challenge.progress}/{challenge.maxProgress}
                            </span>
                          </div>
                          <Progress value={(challenge.progress / challenge.maxProgress) * 100} className="h-3" />
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Reward: {challenge.reward}</span>
                            <Button size="sm" disabled={challenge.progress < challenge.maxProgress}>
                              {challenge.progress >= challenge.maxProgress ? "Claim Reward" : "In Progress"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Reward Store
                </CardTitle>
                <CardDescription>
                  Redeem your points for exclusive rewards and benefits. You have{" "}
                  {userProgress.totalPoints.toLocaleString()} points available.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rewards.map((reward) => (
                    <Card
                      key={reward.id}
                      className={`border transition-all ${!reward.available ? "opacity-60" : "hover:shadow-md"}`}
                    >
                      <CardContent className="p-6">
                        <div className="text-center mb-4">
                          <div className="text-4xl mb-3">{reward.icon}</div>
                          <h4 className="font-semibold text-lg">{reward.name}</h4>
                          <Badge variant="outline" className="mt-2">
                            {reward.category}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground text-center mb-4">{reward.description}</p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-accent">{reward.cost} points</span>
                            {!reward.available && <Badge variant="destructive">Unavailable</Badge>}
                          </div>
                          <Button
                            className="w-full"
                            disabled={!reward.available || userProgress.totalPoints < reward.cost}
                          >
                            {userProgress.totalPoints < reward.cost ? "Not Enough Points" : "Redeem"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Community Leaderboard
                </CardTitle>
                <CardDescription>See how you rank among other Scout users this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-lg border ${
                        user.name === "You" ? "border-accent bg-accent/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold">
                        {user.rank}
                      </div>
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {user.name === "You"
                            ? "ME"
                            : user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{user.name}</span>
                          {user.name === "You" && <Badge variant="secondary">You</Badge>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Level {user.level}</span>
                          <span>{user.badge}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{user.points.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
