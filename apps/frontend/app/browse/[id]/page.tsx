"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Car,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  MessageSquare,
  Phone,
  Fuel,
  Users,
  Gauge,
  Cog,
  Shield,
  Award,
  MapPin,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { use } from "react"

// Mock data - in real app this would come from API
const mockCarDetails = {
  id: 1,
  make: "Toyota",
  model: "Camry",
  year: 2024,
  price: 28500,
  mileage: 12,
  fuelType: "Hybrid",
  transmission: "Automatic",
  seating: 5,
  images: [
    "/toyota-camry-2024-exterior.png",
    "/toyota-camry-2024-interior.png",
    "/toyota-camry-2024-dashboard.png",
    "/toyota-camry-2024-engine.png",
  ],
  features: [
    "Backup Camera",
    "Bluetooth",
    "Lane Assist",
    "Apple CarPlay",
    "Adaptive Cruise Control",
    "Blind Spot Monitoring",
    "Automatic Emergency Braking",
    "Heated Seats",
    "Dual-Zone Climate Control",
    "LED Headlights",
  ],
  mpg: "32/41",
  location: "Downtown Toyota",
  dealership: {
    name: "Downtown Toyota",
    address: "123 Main St, Downtown, CA 90210",
    phone: "(555) 123-4567",
    rating: 4.8,
    reviews: 342,
  },
  specs: {
    engine: "2.5L 4-Cylinder Hybrid",
    horsepower: "208 hp",
    torque: "163 lb-ft",
    drivetrain: "Front-Wheel Drive",
    fuelCapacity: "14.4 gallons",
    cargoSpace: "15.1 cubic feet",
    warranty: "3 years/36,000 miles",
  },
  description:
    "Experience the perfect blend of efficiency and performance with the 2024 Toyota Camry Hybrid. This sedan offers exceptional fuel economy without compromising on comfort or technology. With Toyota Safety Sense 2.0 standard and a spacious interior, it's the ideal choice for daily commuting and long road trips alike.",
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CarDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const car = mockCarDetails // In real app, fetch by ID

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/browse"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Browse
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-foreground">Scout</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden relative">
                <Image
                  src={car.images[0] || "/placeholder.svg"}
                  alt={`${car.year} ${car.make ?? ""} ${car.model ?? ""}`}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement
                    img.onerror = null
                    img.src = "/placeholder.svg"
                  }}
                />
                <Badge
                  variant="secondary"
                  className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm text-foreground font-bold text-xl px-4 py-2"
                >
                  ${car.price.toLocaleString()}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {car.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${car.year} ${car.make ?? ""} ${car.model ?? ""} view ${index + 2}`}
                      width={200}
                      height={133}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                      onError={(e) => {
                        const img = e.currentTarget as HTMLImageElement
                        img.onerror = null
                        img.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle Info */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl">
                      {car.year} {car.make} {car.model}
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">{car.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <Gauge className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm text-muted-foreground">Mileage</div>
                      <div className="font-semibold">{car.mileage.toLocaleString()} mi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <Fuel className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm text-muted-foreground">Fuel Type</div>
                      <div className="font-semibold">{car.fuelType}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <Users className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm text-muted-foreground">Seating</div>
                      <div className="font-semibold">{car.seating} seats</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <Cog className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm text-muted-foreground">Transmission</div>
                      <div className="font-semibold">{car.transmission}</div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Features & Options</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {car.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="justify-start">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Specifications</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {Object.entries(car.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border last:border-b-0">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dealership Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Dealership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">{car.dealership.name}</h4>
                  <p className="text-sm text-muted-foreground">{car.dealership.address}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">
                      {car.dealership.rating} stars ({car.dealership.reviews} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-border">
              <CardContent className="p-6 space-y-4">
                <Button size="lg" className="w-full" asChild>
                  <Link href={`/schedule?car=${car.id}`}>
                    <Calendar className="h-5 w-5 mr-2" />
                    Schedule Test Drive
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full bg-transparent" asChild>
                  <Link href={`/chat?car=${car.id}`}>
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Get AI Recommendation
                  </Link>
                </Button>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Questions about this vehicle?</p>
                  <Button variant="link" className="p-0 h-auto">
                    Contact our specialists
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Peace of Mind
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Vehicle History Report Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Multi-Point Inspection Completed</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">7-Day Return Policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Financing Available</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
