"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Car, Search, Filter, Heart, Eye, ArrowLeft, Fuel, Users, Calendar, Gauge } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ScoutIcon } from "@/components/scout-icon"

// Mock data for demonstration
const mockCars = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2024,
    price: 28500,
    mileage: 12,
    fuelType: "Hybrid",
    transmission: "Automatic",
    seating: 5,
    image: "/toyota-camry-2024.png",
    features: ["Backup Camera", "Bluetooth", "Lane Assist", "Apple CarPlay"],
    mpg: "32/41",
    location: "Downtown Toyota",
    isFavorite: false,
  },
  {
    id: 2,
    make: "Honda",
    model: "Accord",
    year: 2023,
    price: 26800,
    mileage: 8500,
    fuelType: "Gasoline",
    transmission: "CVT",
    seating: 5,
    image: "/honda-accord-2023.png",
    features: ["Sunroof", "Heated Seats", "Honda Sensing", "Wireless Charging"],
    mpg: "30/38",
    location: "Metro Honda",
    isFavorite: true,
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    price: 42990,
    mileage: 2100,
    fuelType: "Electric",
    transmission: "Single Speed",
    seating: 5,
    image: "/tesla-model-3-2024.png",
    features: ["Autopilot", "Supercharging", "Premium Audio", "Glass Roof"],
    mpg: "134 MPGe",
    location: "Tesla Center",
    isFavorite: false,
  },
  {
    id: 4,
    make: "BMW",
    model: "3 Series",
    year: 2023,
    price: 45500,
    mileage: 5200,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seating: 5,
    image: "/bmw-3-series-2023.png",
    features: ["Leather Seats", "Navigation", "Sport Package", "Harman Kardon"],
    mpg: "26/36",
    location: "BMW of Downtown",
    isFavorite: false,
  },
  {
    id: 5,
    make: "Ford",
    model: "F-150",
    year: 2024,
    price: 38200,
    mileage: 1800,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seating: 6,
    image: "/ford-f-150-2024.png",
    features: ["4WD", "Towing Package", "Bed Liner", "Ford Co-Pilot360"],
    mpg: "20/26",
    location: "Ford Country",
    isFavorite: false,
  },
  {
    id: 6,
    make: "Audi",
    model: "A4",
    year: 2023,
    price: 41200,
    mileage: 7300,
    fuelType: "Gasoline",
    transmission: "Automatic",
    seating: 5,
    image: "/audi-a4-2023.png",
    features: ["Quattro AWD", "Virtual Cockpit", "Bang & Olufsen", "Adaptive Cruise"],
    mpg: "24/32",
    location: "Audi Prestige",
    isFavorite: true,
  },
]

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMake, setSelectedMake] = useState("Any make")
  const [selectedFuelType, setSelectedFuelType] = useState("Any fuel type")
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [yearRange, setYearRange] = useState([2020, 2024])
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([2, 6])

  const toggleFavorite = (carId: number) => {
    setFavorites((prev) => (prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]))
  }

  const filteredCars = mockCars.filter((car) => {
    const matchesSearch =
      car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMake = selectedMake === "Any make" || car.make === selectedMake
    const matchesFuel = selectedFuelType === "Any fuel type" || car.fuelType === selectedFuelType
    const matchesPrice = car.price >= priceRange[0] && car.price <= priceRange[1]
    const matchesYear = car.year >= yearRange[0] && car.year <= yearRange[1]

    return matchesSearch && matchesMake && matchesFuel && matchesPrice && matchesYear
  })

  const makes = Array.from(new Set(mockCars.map((car) => car.make)))
  const fuelTypes = Array.from(new Set(mockCars.map((car) => car.fuelType)))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                <ScoutIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Scout</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild>
                <Link href="/chat">Get Recommendations</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <Card className="border-border sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowFilters(!showFilters)}>
                    {showFilters ? "Hide" : "Show"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={`space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
                {/* Search */}
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search make or model..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-input border-border"
                    />
                  </div>
                </div>

                {/* Make */}
                <div className="space-y-2">
                  <Label>Make</Label>
                  <Select value={selectedMake} onValueChange={setSelectedMake}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Any make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any make">Any make</SelectItem>
                      {makes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Fuel Type */}
                <div className="space-y-2">
                  <Label>Fuel Type</Label>
                  <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Any fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Any fuel type">Any fuel type</SelectItem>
                      {fuelTypes.map((fuel) => (
                        <SelectItem key={fuel} value={fuel}>
                          {fuel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>Price Range</Label>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={100000}
                      min={0}
                      step={1000}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0].toLocaleString()}</span>
                    <span>${priceRange[1].toLocaleString()}</span>
                  </div>
                </div>

                {/* Year Range */}
                <div className="space-y-3">
                  <Label>Year Range</Label>
                  <div className="px-2">
                    <Slider
                      value={yearRange}
                      onValueChange={setYearRange}
                      max={2024}
                      min={2015}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{yearRange[0]}</span>
                    <span>{yearRange[1]}</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedMake("Any make")
                    setSelectedFuelType("Any fuel type")
                    setPriceRange([0, 100000])
                    setYearRange([2020, 2024])
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-foreground">Browse Vehicles</h1>
              <div className="text-muted-foreground">{filteredCars.length} vehicles found</div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map((car) => (
                <Card key={car.id} className="border-border hover:shadow-lg transition-all duration-200 group">
                  <div className="relative">
                    <Image
                      src={car.image || "/placeholder.svg"}
                      alt={`${car.year} ${car.make} ${car.model}`}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
                      onClick={() => toggleFavorite(car.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.includes(car.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                      />
                    </Button>
                    <Badge
                      variant="secondary"
                      className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-foreground font-semibold"
                    >
                      ${car.price.toLocaleString()}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {car.year} {car.make} {car.model}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">{car.location}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                        <span>{car.mileage.toLocaleString()} mi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{car.seating} seats</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{car.mpg} MPG</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {car.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {car.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{car.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/browse/${car.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/schedule?car=${car.id}`}>Test Drive</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCars.length === 0 && (
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No vehicles found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search terms to find more vehicles.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedMake("Any make")
                    setSelectedFuelType("Any fuel type")
                    setPriceRange([0, 100000])
                    setYearRange([2020, 2024])
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
