// Tool-related type definitions for MotorScout

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  type: 'SUV' | 'Sedan' | 'Truck' | 'Electric' | 'Hybrid' | 'Coupe' | 'Minivan';
  image: string;
  latitude?: number;
  longitude?: number;
  dealerId?: string;
  dealerName?: string;
  city?: string;
  state?: string;
  zip?: string;
  mpg?: {
    city: number;
    highway: number;
  };
  range?: number; // For electric vehicles
  features: string[];
  available: boolean;
  stock: number;
  color?: string;
  vin?: string;
  mileage?: number;
  transmission?: 'Automatic' | 'Manual' | 'CVT';
  drivetrain?: 'FWD' | 'RWD' | 'AWD' | '4WD';
  engine?: string;
  interiorColor?: string;
  condition?: 'New' | 'Used' | 'Certified Pre-Owned';
}

export interface Dealership {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  distance?: string; // e.g., "2.3 miles"
  rating: number;
  services: string[];
  hours: {
    [key: string]: string; // e.g., { monday: "9:00 AM - 7:00 PM" }
  };
}

export interface TimeSlot {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  available: boolean;
  dealershipId: string;
}

export interface Appointment {
  id: string;
  type: 'test-drive' | 'service' | 'consultation';
  vehicleId?: string;
  vehicle?: Vehicle; // Populated when fetching
  dealershipId: string;
  dealership?: Dealership; // Populated when fetching
  date: string;
  time: string;
  customer: Customer;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  confirmationNumber: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Customer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  preferredContact?: 'email' | 'phone' | 'text';
}

// Tool Response Types
export interface AvailabilityResponse {
  available: boolean;
  vehicle?: Vehicle;
  slots: TimeSlot[];
  dealerships: Dealership[];
  message?: string;
}

export interface AppointmentResponse {
  success: boolean;
  appointment?: Appointment;
  confirmationNumber?: string;
  message: string;
  errors?: string[];
}

export interface InventoryResponse {
  vehicles: Vehicle[];
  total: number;
  filters: {
    make?: string;
    model?: string;
    type?: string;
    priceMin?: number;
    priceMax?: number;
    latitude?: number;
    longitude?: number;
    radiusMiles?: number;
  };
  message?: string;
}

// Search Criteria
export interface VehicleSearchCriteria {
  make?: string;
  model?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  priceMin?: number;
  priceMax?: number;
  type?: Vehicle['type'];
  features?: string[];
  available?: boolean;
  condition?: Vehicle['condition'];
  mpgMin?: number;
  mileageMax?: number;
  latitude?: number;
  longitude?: number;
  radiusMiles?: number; // search radius in miles
}

export interface AppointmentRequest {
  type: Appointment['type'];
  vehicleId?: string;
  dealershipId: string;
  date: string;
  time: string;
  customer: Customer;
  notes?: string;
}