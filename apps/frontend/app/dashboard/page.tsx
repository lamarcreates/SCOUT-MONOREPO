"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GamificationWidget } from "@/components/gamification-widget"
import {
  Car,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  Award,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  Bell,
  Heart,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { ScoutIcon } from "@/components/scout-icon"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john@example.com",
  memberSince: "2023",
  currentVehicle: {
    make: "Honda",
    model: "Accord",
    year: 2021,
    image: "/honda-accord-2023.png",
    mileage: 28500,
    purchasePrice: 32000,
    currentTradeInValue: 24800,
    lastServiceDate: "2024-01-15",
    nextServiceDue: "2024-04-15",
    condition: "Excellent",
  },
  tradeInHistory: [
    { month: "Jan", value: 26200 },
    { month: "Feb", value: 25800 },
    { month: "Mar", value: 25400 },
    { month: "Apr", value: 25100 },
    { month: "May", value: 24900 },
    { month: "Jun", value: 24800 },
  ],
  upcomingAppointments: [
    {
      id: 1,
      type: "Service",
      date: "2024-04-15",
      time: "10:00 AM",
      location: "Metro Honda Service",
      status: "confirmed",
    },
    {
      id: 2,
      type: "Test Drive",
      date: "2024-04-20",
      time: "2:00 PM",
      location: "Downtown Toyota",
      status: "pending",
      vehicle: "2024 Toyota Camry",
    },
  ],
  savedVehicles: [
    {
      id: 1,
      make: "Toyota",
      model: "Camry Hybrid",
      year: 2024,
      price: 28500,
      image: "/toyota-camry-2024.png",
      matchScore: 95,
    },
    {
      id: 2,
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      price: 42990,
      image: "/tesla-model-3-2024.png",
      matchScore: 88,
    },
  ],
  achievements: [
    { name: "Regular Maintenance", icon: "🔧", earned: true, description: "Kept up with all service appointments" },
    { name: "Fuel Efficient Driver", icon: "⛽", earned: true, description: "Maintained excellent fuel economy" },
    { name: "Safety First", icon: "🛡️", earned: true, description: "No accidents or claims" },
    { name: "Trade-in Expert", icon: "💰", earned: false, description: "Complete your first trade-in" },
  ],
  automotiveScore: 850,
  scoreFactors: [
    { factor: "Service History", score: 95, impact: "Excellent" },
    { factor: "Driving Habits", score: 88, impact: "Good" },
    { factor: "Vehicle Condition", score: 92, impact: "Excellent" },
    { factor: "Market Timing", score: 78, impact: "Fair" },
  ],
}

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const currentVehicle = userData.currentVehicle
  const valueChange = currentVehicle.currentTradeInValue - userData.tradeInHistory[0].value
  const valueChangePercent = ((valueChange / userData.tradeInHistory[0].value) * 100).toFixed(1)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <ScoutIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Scout</span>
              </Link>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {userData.name}!</h1>
          <p className="text-muted-foreground">
            Here's your automotive dashboard with live trade-in values and personalized insights.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vehicle">My Vehicle</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="recommendations">Saved Cars</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Trade-In Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        ${currentVehicle.currentTradeInValue.toLocaleString()}
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm ${valueChange >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {valueChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {valueChange >= 0 ? "+" : ""}${Math.abs(valueChange).toLocaleString()} ({valueChangePercent}%)
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Automotive Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{userData.automotiveScore}</div>
                      <div className="text-sm text-green-600">Excellent</div>
                    </div>
                    <Award className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Next Service</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold text-foreground">Apr 15</div>
                      <div className="text-sm text-muted-foreground">Oil Change Due</div>
                    </div>
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Saved Vehicles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{userData.savedVehicles.length}</div>
                      <div className="text-sm text-muted-foreground">Ready to explore</div>
                    </div>
                    <Heart className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trade-In Value Chart and Gamification Widget */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {/* Trade-In Value Chart */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Trade-In Value Trend
                    </CardTitle>
                    <CardDescription>Track how your vehicle's value changes over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userData.tradeInHistory}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="month" className="text-muted-foreground" />
                          <YAxis className="text-muted-foreground" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="hsl(var(--accent))"
                            fill="hsl(var(--accent))"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <GamificationWidget
                  recentAchievement={{
                    name: "Maintenance Master",
                    icon: "🔧",
                    points: 750,
                  }}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/chat">
                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <MessageSquare className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Get Recommendations</h3>
                        <p className="text-sm text-muted-foreground">Chat with AI for personalized suggestions</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/browse">
                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Car className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Browse Vehicles</h3>
                        <p className="text-sm text-muted-foreground">Explore our inventory</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/schedule">
                <Card className="border-border hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-lg">
                        <Calendar className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Schedule Service</h3>
                        <p className="text-sm text-muted-foreground">Book maintenance appointments</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          <TabsContent value="vehicle" className="space-y-6">
            {/* Current Vehicle */}
            <Card className="border-border relative">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  My Current Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Image
                      src={currentVehicle.image || "/placeholder.svg"}
                      alt={`${currentVehicle.year} ${currentVehicle.make} ${currentVehicle.model}`}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Badge
                      variant="secondary"
                      className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm text-foreground"
                    >
                      {currentVehicle.condition} Condition
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">
                        {currentVehicle.year} {currentVehicle.make} {currentVehicle.model}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Mileage</p>
                        <p className="font-semibold">{currentVehicle.mileage.toLocaleString()} miles</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Purchase Price</p>
                        <p className="font-semibold">${currentVehicle.purchasePrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Last Service</p>
                        <p className="font-semibold">{currentVehicle.lastServiceDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Next Service Due</p>
                        <p className="font-semibold">{currentVehicle.nextServiceDue}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-accent/10 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Current Trade-In Value</span>
                        <span className="text-2xl font-bold text-accent">
                          ${currentVehicle.currentTradeInValue.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Value updates based on market conditions, mileage, and maintenance history
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Score Factors */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Automotive Score Breakdown
                </CardTitle>
                <CardDescription>Factors affecting your trade-in value and automotive profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.scoreFactors.map((factor, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{factor.factor}</span>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            factor.impact === "Excellent"
                              ? "default"
                              : factor.impact === "Good"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {factor.impact}
                        </Badge>
                        <span className="font-semibold">{factor.score}/100</span>
                      </div>
                    </div>
                    <Progress value={factor.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Achievements
                </CardTitle>
                <CardDescription>Your automotive milestones and accomplishments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {userData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        achievement.earned ? "bg-accent/10 border-accent/20" : "bg-muted/30 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-semibold">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.earned && <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your scheduled services and test drives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userData.upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          {appointment.type === "Service" ? (
                            <Settings className="h-5 w-5 text-accent" />
                          ) : (
                            <Car className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            {appointment.type}
                            {appointment.vehicle && ` - ${appointment.vehicle}`}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {appointment.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {appointment.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {appointment.location}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                <Button className="w-full" asChild>
                  <Link href="/schedule">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Appointment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Saved Vehicles
                </CardTitle>
                <CardDescription>Vehicles you've saved for future consideration</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {userData.savedVehicles.map((vehicle) => (
                    <Card key={vehicle.id} className="border-border hover:shadow-md transition-shadow relative">
                      <div className="relative">
                        <Image
                          src={vehicle.image || "/placeholder.svg"}
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2 bg-accent/90 backdrop-blur-sm text-accent-foreground font-semibold">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {vehicle.matchScore}% match
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold mb-2">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h4>
                        <p className="text-lg font-bold text-accent mb-4">${vehicle.price.toLocaleString()}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/browse/${vehicle.id}`}>View Details</Link>
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                            <Link href={`/schedule?car=${vehicle.id}`}>Test Drive</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center py-8">
                  <Button asChild>
                    <Link href="/browse">
                      <Car className="h-4 w-4 mr-2" />
                      Browse More Vehicles
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
