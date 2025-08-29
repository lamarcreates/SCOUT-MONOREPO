"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Car,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  Star,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock admin data
const adminData = {
  dealership: {
    name: "Downtown Toyota",
    address: "123 Main St, Downtown, CA 90210",
    phone: "(555) 123-4567",
    manager: "Sarah Johnson",
  },
  metrics: {
    todayAppointments: 12,
    pendingAppointments: 5,
    monthlyRevenue: 485000,
    inventoryCount: 47,
    customerSatisfaction: 4.8,
    conversionRate: 23,
  },
  recentAppointments: [
    {
      id: 1,
      customer: "John Smith",
      type: "Test Drive",
      vehicle: "2024 Toyota Camry",
      date: "2024-04-15",
      time: "10:00 AM",
      status: "confirmed",
      phone: "(555) 234-5678",
      email: "john@example.com",
    },
    {
      id: 2,
      customer: "Emily Davis",
      type: "Service",
      vehicle: "2021 Honda Accord",
      date: "2024-04-15",
      time: "2:00 PM",
      status: "pending",
      phone: "(555) 345-6789",
      email: "emily@example.com",
    },
    {
      id: 3,
      customer: "Michael Brown",
      type: "Consultation",
      vehicle: "N/A",
      date: "2024-04-16",
      time: "11:00 AM",
      status: "confirmed",
      phone: "(555) 456-7890",
      email: "michael@example.com",
    },
    {
      id: 4,
      customer: "Lisa Wilson",
      type: "Test Drive",
      vehicle: "2024 Tesla Model 3",
      date: "2024-04-16",
      time: "3:30 PM",
      status: "cancelled",
      phone: "(555) 567-8901",
      email: "lisa@example.com",
    },
  ],
  inventory: [
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      year: 2024,
      price: 28500,
      stock: 8,
      status: "available",
      image: "/toyota-camry-2024.png",
      inquiries: 15,
      testDrives: 7,
    },
    {
      id: 2,
      make: "Honda",
      model: "Accord",
      year: 2023,
      price: 26800,
      stock: 5,
      status: "low-stock",
      image: "/honda-accord-2023.png",
      inquiries: 12,
      testDrives: 5,
    },
    {
      id: 3,
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      price: 42990,
      stock: 0,
      status: "out-of-stock",
      image: "/tesla-model-3-2024.png",
      inquiries: 23,
      testDrives: 3,
    },
  ],
  customers: [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 234-5678",
      lastVisit: "2024-04-10",
      totalSpent: 32000,
      status: "active",
      interests: ["Toyota Camry", "Honda Accord"],
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "(555) 345-6789",
      lastVisit: "2024-04-08",
      totalSpent: 0,
      status: "prospect",
      interests: ["Tesla Model 3"],
    },
  ],
  salesData: [
    { month: "Jan", sales: 45, revenue: 1200000 },
    { month: "Feb", sales: 52, revenue: 1380000 },
    { month: "Mar", sales: 48, revenue: 1280000 },
    { month: "Apr", sales: 38, revenue: 1020000 },
    { month: "May", sales: 55, revenue: 1450000 },
    { month: "Jun", sales: 42, revenue: 1120000 },
  ],
  appointmentTypes: [
    { name: "Test Drive", value: 45, color: "#8b5cf6" },
    { name: "Service", value: 30, color: "#3b82f6" },
    { name: "Consultation", value: 25, color: "#10b981" },
  ],
}

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")
  const [testLocation, setTestLocation] = useState("Austin, TX")
  const [radius, setRadius] = useState(25)
  const [make, setMake] = useState("")
  const [model, setModel] = useState("")
  const [loadingListings, setLoadingListings] = useState(false)
  const [listings, setListings] = useState<any[]>([])
  const [listingsError, setListingsError] = useState<string | null>(null)

  async function geocode(address: string): Promise<{ lat: number; lon: number } | null> {
    try {
      const res = await fetch(`/api/geocode`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      })
      if (!res.ok) return null
      const data = await res.json()
      if (typeof data?.latitude === 'number' && typeof data?.longitude === 'number') {
        return { lat: data.latitude, lon: data.longitude }
      }
      return null
    } catch {
      return null
    }
  }

  async function runListingsTest() {
    setLoadingListings(true)
    setListingsError(null)
    setListings([])
    try {
      let coords = await geocode(testLocation)
      if (!coords) throw new Error('Failed to geocode location')
      const res = await fetch(`/api/tools/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: coords.lat,
          longitude: coords.lon,
          radiusMiles: radius,
          make: make || undefined,
          model: model || undefined,
          limit: 24
        })
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setListings(Array.isArray(data.vehicles) ? data.vehicles : [])
    } catch (e: any) {
      setListingsError(e?.message || 'Failed to fetch listings')
    } finally {
      setLoadingListings(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockStatus = (status: string) => {
    switch (status) {
      case "available":
        return { color: "bg-green-100 text-green-800", label: "Available" }
      case "low-stock":
        return { color: "bg-yellow-100 text-yellow-800", label: "Low Stock" }
      case "out-of-stock":
        return { color: "bg-red-100 text-red-800", label: "Out of Stock" }
      default:
        return { color: "bg-gray-100 text-gray-800", label: "Unknown" }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Car className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Scout</span>
              </div>
              <Badge variant="secondary">Admin Dashboard</Badge>
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
                <AvatarFallback>SJ</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{adminData.dealership.manager}</p>
                <p className="text-xs text-muted-foreground">{adminData.dealership.name}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage appointments, customers, and inventory for {adminData.dealership.name}
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="listings">Listings Tester</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Today's Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{adminData.metrics.todayAppointments}</div>
                      <div className="text-sm text-muted-foreground">
                        {adminData.metrics.pendingAppointments} pending
                      </div>
                    </div>
                    <Calendar className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">
                        ${adminData.metrics.monthlyRevenue.toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">+12% from last month</div>
                    </div>
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{adminData.metrics.inventoryCount}</div>
                      <div className="text-sm text-muted-foreground">vehicles available</div>
                    </div>
                    <Car className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{adminData.metrics.customerSatisfaction}</div>
                      <div className="text-sm text-muted-foreground">out of 5.0</div>
                    </div>
                    <Star className="h-8 w-8 text-accent" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Recent Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {adminData.recentAppointments.slice(0, 4).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {appointment.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{appointment.customer}</p>
                            <p className="text-xs text-muted-foreground">
                              {appointment.type} - {appointment.date} at {appointment.time}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                    <Link href="#appointments" onClick={() => setSelectedTab("appointments")}>
                      View All Appointments
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Appointment Types
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={adminData.appointmentTypes}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {adminData.appointmentTypes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 mt-4">
                    {adminData.appointmentTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }}></div>
                        <span className="text-sm">{type.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appointment Management</CardTitle>
                    <CardDescription>View and manage customer appointments</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search appointments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input border-border"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.recentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {appointment.customer
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{appointment.customer}</span>
                          </div>
                        </TableCell>
                        <TableCell>{appointment.type}</TableCell>
                        <TableCell>{appointment.vehicle}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.date}</p>
                            <p className="text-sm text-muted-foreground">{appointment.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Customer Management</CardTitle>
                    <CardDescription>View and manage customer relationships</CardDescription>
                  </div>
                  <Button>Add Customer</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Interests</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminData.customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{customer.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{customer.email}</p>
                            <p className="text-sm text-muted-foreground">{customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{customer.lastVisit}</TableCell>
                        <TableCell>${customer.totalSpent.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={customer.status === "active" ? "default" : "secondary"}>
                            {customer.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {customer.interests.slice(0, 2).map((interest, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Inventory Management</CardTitle>
                    <CardDescription>Manage vehicle inventory and availability</CardDescription>
                  </div>
                  <Button>Add Vehicle</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {adminData.inventory.map((vehicle) => {
                    const stockStatus = getStockStatus(vehicle.status)
                    return (
                      <Card key={vehicle.id} className="border-border">
                        <div className="relative">
                          <Image
                            src={vehicle.image || "/placeholder.svg"}
                            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                            width={300}
                            height={200}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                          <Badge className={`absolute top-2 right-2 ${stockStatus.color}`}>{stockStatus.label}</Badge>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </h4>
                              <p className="text-lg font-bold text-accent">${vehicle.price.toLocaleString()}</p>
                            </div>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-center mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Stock</p>
                              <p className="font-semibold">{vehicle.stock}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Inquiries</p>
                              <p className="font-semibold">{vehicle.inquiries}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Test Drives</p>
                              <p className="font-semibold">{vehicle.testDrives}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Performance
                </CardTitle>
                <CardDescription>Track sales trends and revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={adminData.salesData}>
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
                        dataKey="sales"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent))"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <span className="text-sm font-semibold">{adminData.metrics.conversionRate}%</span>
                    </div>
                    <Progress value={adminData.metrics.conversionRate} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Customer Satisfaction</span>
                      <span className="text-sm font-semibold">{adminData.metrics.customerSatisfaction}/5.0</span>
                    </div>
                    <Progress value={(adminData.metrics.customerSatisfaction / 5) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Average Deal Size</span>
                    <span className="font-semibold">$28,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Time to Close</span>
                    <span className="font-semibold">14 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Repeat Customers</span>
                    <span className="font-semibold">34%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Referral Rate</span>
                    <span className="font-semibold">18%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Listings Tester</CardTitle>
                <CardDescription>Provider: MarketCheck — query live vehicle listings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm">Location</label>
                    <Input value={testLocation} onChange={(e) => setTestLocation(e.target.value)} placeholder="City, State or Address" />
                  </div>
                  <div>
                    <label className="text-sm">Radius (miles)</label>
                    <Input type="number" value={radius} onChange={(e) => setRadius(parseInt(e.target.value || '0', 10))} />
                  </div>
                  <div>
                    <label className="text-sm">Make</label>
                    <Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g., Toyota" />
                  </div>
                  <div>
                    <label className="text-sm">Model</label>
                    <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., RAV4" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={runListingsTest} disabled={loadingListings}>
                    {loadingListings ? 'Searching…' : 'Search Listings'}
                  </Button>
                </div>
                {listingsError && (
                  <div className="text-sm text-red-500">{listingsError}</div>
                )}
                <Separator />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((v, idx) => (
                    <Card key={idx} className="border-border">
                      <div className="relative">
                        <Image src={v.image || '/placeholder.svg'} alt={`${v.year} ${v.make} ${v.model}`} width={300} height={200} className="w-full h-40 object-cover rounded-t-lg" unoptimized />
                        <Badge className="absolute top-2 right-2">{v.condition || 'Used'}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{v.year} {v.make} {v.model}</h4>
                            <p className="text-lg font-bold text-accent">${(v.price || 0).toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{v.city}, {v.state} {v.zip}</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">Dealer: {v.dealerName || v.dealerId || '—'}</div>
                      </CardContent>
                    </Card>
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
