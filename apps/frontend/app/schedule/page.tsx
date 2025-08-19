"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Car, ArrowLeft, Clock, MapPin, Phone, Settings, MessageSquare, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data
const dealerships = [
  {
    id: 1,
    name: "Downtown Toyota",
    address: "123 Main St, Downtown, CA 90210",
    phone: "(555) 123-4567",
    rating: 4.8,
    distance: "2.3 miles",
    services: ["Sales", "Service", "Test Drives"],
  },
  {
    id: 2,
    name: "Metro Honda",
    address: "456 Oak Ave, Metro, CA 90211",
    phone: "(555) 234-5678",
    rating: 4.6,
    distance: "3.1 miles",
    services: ["Sales", "Service", "Test Drives"],
  },
  {
    id: 3,
    name: "BMW of Downtown",
    address: "789 Pine St, Downtown, CA 90210",
    phone: "(555) 345-6789",
    rating: 4.9,
    distance: "1.8 miles",
    services: ["Sales", "Service", "Test Drives"],
  },
]

const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
]

const testDriveVehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry Hybrid",
    year: 2024,
    price: 28500,
    image: "/toyota-camry-2024.png",
    available: true,
  },
  {
    id: 2,
    make: "Honda",
    model: "Accord",
    year: 2023,
    price: 26800,
    image: "/honda-accord-2023.png",
    available: true,
  },
  {
    id: 3,
    make: "Tesla",
    model: "Model 3",
    year: 2024,
    price: 42990,
    image: "/tesla-model-3-2024.png",
    available: false,
  },
]

export default function SchedulePage() {
  const [appointmentType, setAppointmentType] = useState("test-drive")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedDealership, setSelectedDealership] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Car className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">Scout</span>
              </Link>
              <Badge variant="secondary">Appointment Confirmed</Badge>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Appointment Confirmed!</h1>
              <p className="text-lg text-muted-foreground">
                Your {appointmentType.replace("-", " ")} has been successfully scheduled.
              </p>
            </div>

            <Card className="border-border text-left">
              <CardHeader>
                <CardTitle>Appointment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Type</Label>
                    <p className="font-semibold capitalize">{appointmentType.replace("-", " ")}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date & Time</Label>
                    <p className="font-semibold">
                      {selectedDate?.toLocaleDateString()} at {selectedTime}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="font-semibold">
                      {dealerships.find((d) => d.id.toString() === selectedDealership)?.name}
                    </p>
                  </div>
                  {selectedVehicle && (
                    <div>
                      <Label className="text-muted-foreground">Vehicle</Label>
                      <p className="font-semibold">
                        {testDriveVehicles.find((v) => v.id.toString() === selectedVehicle)?.year}{" "}
                        {testDriveVehicles.find((v) => v.id.toString() === selectedVehicle)?.make}{" "}
                        {testDriveVehicles.find((v) => v.id.toString() === selectedVehicle)?.model}
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                    A confirmation email has been sent to {customerInfo.email}. You'll receive a reminder 24 hours
                    before your appointment.
                  </p>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/schedule">Schedule Another</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

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
            <Badge variant="secondary">Step {currentStep} of 4</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Schedule an Appointment</h1>
            <p className="text-muted-foreground">
              Book a test drive, service appointment, or consultation with our trusted dealership partners.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step <= currentStep ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-accent" : "bg-muted"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Appointment Type */}
            {currentStep === 1 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>What type of appointment would you like to schedule?</CardTitle>
                  <CardDescription>Choose the service that best fits your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={appointmentType} onValueChange={setAppointmentType} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="test-drive">Test Drive</TabsTrigger>
                      <TabsTrigger value="service">Service</TabsTrigger>
                      <TabsTrigger value="consultation">Consultation</TabsTrigger>
                    </TabsList>

                    <TabsContent value="test-drive" className="space-y-4">
                      <div className="p-4 bg-accent/10 rounded-lg">
                        <h3 className="font-semibold mb-2">Test Drive</h3>
                        <p className="text-sm text-muted-foreground">
                          Experience your potential new vehicle firsthand. Our experts will guide you through the
                          features and answer any questions.
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {testDriveVehicles.map((vehicle) => (
                          <Card
                            key={vehicle.id}
                            className={`border cursor-pointer transition-all ${
                              selectedVehicle === vehicle.id.toString()
                                ? "border-accent bg-accent/5"
                                : "border-border hover:border-accent/50"
                            } ${!vehicle.available ? "opacity-50" : ""}`}
                            onClick={() => vehicle.available && setSelectedVehicle(vehicle.id.toString())}
                          >
                            <div className="relative">
                              <Image
                                src={vehicle.image || "/placeholder.svg"}
                                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                width={200}
                                height={120}
                                className="w-full h-24 object-cover rounded-t-lg"
                              />
                              {!vehicle.available && (
                                <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                                  <Badge variant="destructive">Unavailable</Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-3">
                              <h4 className="font-semibold text-sm">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                              </h4>
                              <p className="text-sm text-muted-foreground">${vehicle.price.toLocaleString()}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="service" className="space-y-4">
                      <div className="p-4 bg-accent/10 rounded-lg">
                        <h3 className="font-semibold mb-2">Service Appointment</h3>
                        <p className="text-sm text-muted-foreground">
                          Keep your vehicle in top condition with professional maintenance and repair services.
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Settings className="h-8 w-8 text-accent" />
                              <div>
                                <h4 className="font-semibold">Regular Maintenance</h4>
                                <p className="text-sm text-muted-foreground">
                                  Oil changes, tire rotations, inspections
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <Settings className="h-8 w-8 text-accent" />
                              <div>
                                <h4 className="font-semibold">Repair Services</h4>
                                <p className="text-sm text-muted-foreground">
                                  Diagnostics, parts replacement, warranty work
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="consultation" className="space-y-4">
                      <div className="p-4 bg-accent/10 rounded-lg">
                        <h3 className="font-semibold mb-2">Sales Consultation</h3>
                        <p className="text-sm text-muted-foreground">
                          Meet with our sales experts to discuss your needs, financing options, and find the perfect
                          vehicle.
                        </p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <MessageSquare className="h-8 w-8 text-accent" />
                              <div>
                                <h4 className="font-semibold">Vehicle Consultation</h4>
                                <p className="text-sm text-muted-foreground">Discuss your needs and preferences</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-border">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <MessageSquare className="h-8 w-8 text-accent" />
                              <div>
                                <h4 className="font-semibold">Financing Options</h4>
                                <p className="text-sm text-muted-foreground">Explore loans, leases, and trade-ins</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end pt-6">
                    <Button onClick={nextStep} disabled={appointmentType === "test-drive" && !selectedVehicle}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Date & Time */}
            {currentStep === 2 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>Choose your preferred appointment date and time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <Label className="text-base font-semibold mb-4 block">Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="rounded-md border border-border"
                      />
                    </div>
                    <div>
                      <Label className="text-base font-semibold mb-4 block">Select Time</Label>
                      <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            className="justify-start bg-transparent"
                            onClick={() => setSelectedTime(time)}
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button onClick={nextStep} disabled={!selectedDate || !selectedTime}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Choose Dealership</CardTitle>
                  <CardDescription>Select your preferred location for the appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedDealership} onValueChange={setSelectedDealership} className="space-y-4">
                    {dealerships.map((dealership) => (
                      <Card
                        key={dealership.id}
                        className={`border cursor-pointer transition-all ${
                          selectedDealership === dealership.id.toString()
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                        onClick={() => setSelectedDealership(dealership.id.toString())}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <RadioGroupItem value={dealership.id.toString()} className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">{dealership.name}</h4>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      {dealership.distance}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {dealership.phone}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{dealership.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{dealership.address}</p>
                              <div className="flex gap-2">
                                {dealership.services.map((service) => (
                                  <Badge key={service} variant="outline" className="text-xs">
                                    {service}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-between pt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button onClick={nextStep} disabled={!selectedDealership}>
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Contact Information */}
            {currentStep === 4 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Provide your details so we can confirm your appointment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, firstName: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, lastName: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="bg-input border-border"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Requests or Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                      placeholder="Any specific requirements or questions you'd like to discuss..."
                      className="bg-input border-border"
                      rows={3}
                    />
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Appointment Summary</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Type:</span> {appointmentType.replace("-", " ")}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Date & Time:</span> {selectedDate?.toLocaleDateString()}{" "}
                        at {selectedTime}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Location:</span>{" "}
                        {dealerships.find((d) => d.id.toString() === selectedDealership)?.name}
                      </p>
                      {selectedVehicle && (
                        <p>
                          <span className="text-muted-foreground">Vehicle:</span>{" "}
                          {testDriveVehicles.find((v) => v.id.toString() === selectedVehicle)?.year}{" "}
                          {testDriveVehicles.find((v) => v.id.toString() === selectedVehicle)?.make}{" "}
                          {testDriveVehicles.find((v) => v.id.toString() === selectedVehicle)?.model}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone
                      }
                    >
                      Confirm Appointment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
