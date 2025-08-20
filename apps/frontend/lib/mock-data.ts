import type { Vehicle, Dealership, TimeSlot, Appointment, Customer } from './tools-types';

// Mock Vehicles with real-looking data and placeholder images
// Easy to replace with: const vehicles = await db.vehicles.findMany()
export const mockVehicles: Vehicle[] = [
  // SUVs
  {
    id: 'v1',
    make: 'Toyota',
    model: 'RAV4 Hybrid',
    year: 2024,
    price: 35990,
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=800&h=600&fit=crop',
    mpg: { city: 41, highway: 38 },
    features: ['AWD', 'Toyota Safety Sense 2.5+', 'Blind Spot Monitor', 'Apple CarPlay'],
    available: true,
    stock: 5,
    color: 'Magnetic Gray Metallic',
    transmission: 'CVT',
    drivetrain: 'AWD',
    engine: '2.5L 4-Cylinder Hybrid',
    condition: 'New'
  },
  {
    id: 'v2',
    make: 'Honda',
    model: 'CR-V',
    year: 2024,
    price: 33450,
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800&h=600&fit=crop',
    mpg: { city: 28, highway: 34 },
    features: ['Honda Sensing', 'Real Time AWD', 'Wireless Apple CarPlay', 'Remote Start'],
    available: true,
    stock: 3,
    color: 'Platinum White Pearl',
    transmission: 'CVT',
    drivetrain: 'AWD',
    engine: '1.5L Turbo 4-Cylinder',
    condition: 'New'
  },
  {
    id: 'v3',
    make: 'Ford',
    model: 'Explorer',
    year: 2024,
    price: 42870,
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop',
    mpg: { city: 21, highway: 28 },
    features: ['4WD', 'Ford Co-Pilot360', '3rd Row Seating', 'SYNC 4'],
    available: true,
    stock: 2,
    color: 'Atlas Blue Metallic',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engine: '2.3L EcoBoost I-4',
    condition: 'New'
  },
  {
    id: 'v4',
    make: 'Mazda',
    model: 'CX-5',
    year: 2024,
    price: 29900,
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&h=600&fit=crop',
    mpg: { city: 25, highway: 31 },
    features: ['i-Activsense Safety', 'Mazda Connect', 'AWD', 'Adaptive Cruise Control'],
    available: true,
    stock: 4,
    color: 'Soul Red Crystal Metallic',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: '2.5L 4-Cylinder',
    condition: 'New'
  },

  // Sedans
  {
    id: 'v5',
    make: 'Toyota',
    model: 'Camry Hybrid',
    year: 2024,
    price: 28545,
    type: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    mpg: { city: 51, highway: 53 },
    features: ['Toyota Safety Sense 2.5+', 'Hybrid Drivetrain', 'JBL Audio', 'Panoramic Roof'],
    available: true,
    stock: 6,
    color: 'Celestial Silver Metallic',
    transmission: 'CVT',
    drivetrain: 'FWD',
    engine: '2.5L 4-Cylinder Hybrid',
    condition: 'New'
  },
  {
    id: 'v6',
    make: 'Honda',
    model: 'Accord Hybrid',
    year: 2024,
    price: 32995,
    type: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&h=600&fit=crop',
    mpg: { city: 48, highway: 47 },
    features: ['Honda Sensing', 'Bose Audio', 'Wireless Charging', 'Head-Up Display'],
    available: true,
    stock: 3,
    color: 'Radiant Red Metallic',
    transmission: 'CVT',
    drivetrain: 'FWD',
    engine: '2.0L 4-Cylinder Hybrid',
    condition: 'New'
  },
  {
    id: 'v7',
    make: 'BMW',
    model: '330i',
    year: 2024,
    price: 44295,
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop',
    mpg: { city: 26, highway: 36 },
    features: ['xDrive AWD', 'BMW Live Cockpit', 'Driving Assistance', 'Harman Kardon Audio'],
    available: true,
    stock: 2,
    color: 'Alpine White',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: '2.0L TwinPower Turbo',
    condition: 'New'
  },

  // Electric Vehicles
  {
    id: 'v8',
    make: 'Tesla',
    model: 'Model 3',
    year: 2024,
    price: 42990,
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
    range: 272,
    features: ['Autopilot', 'Full Self-Driving Capability', 'Premium Audio', 'Glass Roof'],
    available: true,
    stock: 4,
    color: 'Pearl White',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    engine: 'Electric Motor',
    condition: 'New'
  },
  {
    id: 'v9',
    make: 'Tesla',
    model: 'Model Y',
    year: 2024,
    price: 52990,
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1619317083226-9f668d05094e?w=800&h=600&fit=crop',
    range: 310,
    features: ['Autopilot', 'AWD Dual Motor', '7 Seats', 'Premium Interior'],
    available: true,
    stock: 3,
    color: 'Midnight Silver Metallic',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: 'Dual Motor Electric',
    condition: 'New'
  },
  {
    id: 'v10',
    make: 'Ford',
    model: 'Mustang Mach-E',
    year: 2024,
    price: 45995,
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800&h=600&fit=crop',
    range: 250,
    features: ['BlueCruise', 'B&O Sound System', 'Panoramic Roof', 'Phone As Key'],
    available: true,
    stock: 2,
    color: 'Grabber Blue Metallic',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: 'Electric Motor',
    condition: 'New'
  },
  {
    id: 'v11',
    make: 'Hyundai',
    model: 'Ioniq 5',
    year: 2024,
    price: 41450,
    type: 'Electric',
    image: 'https://images.unsplash.com/photo-1629897048514-3dd7414fe72a?w=800&h=600&fit=crop',
    range: 266,
    features: ['Highway Driving Assist 2', 'V2L Capability', 'Ultra-Fast Charging', 'Augmented Reality HUD'],
    available: true,
    stock: 3,
    color: 'Digital Teal',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: 'Dual Motor Electric',
    condition: 'New'
  },

  // Trucks
  {
    id: 'v12',
    make: 'Ford',
    model: 'F-150 Lightning',
    year: 2024,
    price: 62995,
    type: 'Truck',
    image: 'https://images.unsplash.com/photo-1581541234269-03d5d8576c0e?w=800&h=600&fit=crop',
    range: 240,
    features: ['Electric', 'Pro Power Onboard', 'BlueCruise', 'Towing Technology'],
    available: true,
    stock: 2,
    color: 'Antimatter Blue',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engine: 'Dual Motor Electric',
    condition: 'New'
  },
  {
    id: 'v13',
    make: 'Chevrolet',
    model: 'Silverado 1500',
    year: 2024,
    price: 38395,
    type: 'Truck',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&h=600&fit=crop',
    mpg: { city: 18, highway: 24 },
    features: ['4WD', 'Multi-Flex Tailgate', 'Tow Package', '13.4" Touchscreen'],
    available: true,
    stock: 4,
    color: 'Black',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engine: '5.3L V8',
    condition: 'New'
  },

  // Luxury
  {
    id: 'v14',
    make: 'Mercedes-Benz',
    model: 'E-Class',
    year: 2024,
    price: 63050,
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop',
    mpg: { city: 22, highway: 31 },
    features: ['4MATIC AWD', 'MBUX', 'Driver Assistance Package', 'Burmester Audio'],
    available: true,
    stock: 1,
    color: 'Obsidian Black Metallic',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: '2.0L Turbo 4-Cylinder',
    condition: 'New'
  },
  {
    id: 'v15',
    make: 'Audi',
    model: 'Q5',
    year: 2024,
    price: 45900,
    type: 'SUV',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    mpg: { city: 23, highway: 29 },
    features: ['Quattro AWD', 'Virtual Cockpit', 'MMI Touch', 'Bang & Olufsen Audio'],
    available: true,
    stock: 2,
    color: 'Glacier White Metallic',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engine: '2.0L TFSI 4-Cylinder',
    condition: 'New'
  },

  // Used Vehicles
  {
    id: 'v16',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 21990,
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800&h=600&fit=crop',
    mpg: { city: 31, highway: 40 },
    features: ['Toyota Safety Sense 2.0', 'Apple CarPlay', 'Adaptive Cruise Control'],
    available: true,
    stock: 3,
    color: 'Blueprint',
    mileage: 28500,
    transmission: 'CVT',
    drivetrain: 'FWD',
    engine: '1.8L 4-Cylinder',
    condition: 'Used'
  },
  {
    id: 'v17',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    price: 23450,
    type: 'Sedan',
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&h=600&fit=crop',
    mpg: { city: 31, highway: 40 },
    features: ['Honda Sensing', 'Sport Mode', 'Bose Audio'],
    available: true,
    stock: 2,
    color: 'Sonic Gray Pearl',
    mileage: 22000,
    transmission: 'CVT',
    drivetrain: 'FWD',
    engine: '2.0L 4-Cylinder',
    condition: 'Certified Pre-Owned'
  }
];

// Mock Dealerships
// Easy to replace with: const dealerships = await db.dealerships.findMany()
export const mockDealerships: Dealership[] = [
  {
    id: 'd1',
    name: 'Downtown Toyota',
    address: '123 Main Street',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    phone: '(555) 123-4567',
    email: 'info@downtowntoyota.com',
    latitude: 34.0522,
    longitude: -118.2437,
    distance: '2.3 miles',
    rating: 4.8,
    services: ['Sales', 'Service', 'Parts', 'Test Drives'],
    hours: {
      monday: '9:00 AM - 8:00 PM',
      tuesday: '9:00 AM - 8:00 PM',
      wednesday: '9:00 AM - 8:00 PM',
      thursday: '9:00 AM - 8:00 PM',
      friday: '9:00 AM - 8:00 PM',
      saturday: '9:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM'
    }
  },
  {
    id: 'd2',
    name: 'Metro Honda',
    address: '456 Oak Avenue',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90211',
    phone: '(555) 234-5678',
    email: 'sales@metrohonda.com',
    latitude: 34.0622,
    longitude: -118.2537,
    distance: '3.1 miles',
    rating: 4.6,
    services: ['Sales', 'Service', 'Parts', 'Test Drives'],
    hours: {
      monday: '9:00 AM - 7:00 PM',
      tuesday: '9:00 AM - 7:00 PM',
      wednesday: '9:00 AM - 7:00 PM',
      thursday: '9:00 AM - 7:00 PM',
      friday: '9:00 AM - 7:00 PM',
      saturday: '9:00 AM - 6:00 PM',
      sunday: '11:00 AM - 5:00 PM'
    }
  },
  {
    id: 'd3',
    name: 'Luxury Motors BMW',
    address: '789 Pine Boulevard',
    city: 'Beverly Hills',
    state: 'CA',
    zip: '90210',
    phone: '(555) 345-6789',
    email: 'contact@luxurymotorsbmw.com',
    latitude: 34.0722,
    longitude: -118.4037,
    distance: '1.8 miles',
    rating: 4.9,
    services: ['Sales', 'Service', 'Parts', 'Test Drives', 'Financing'],
    hours: {
      monday: '8:30 AM - 8:00 PM',
      tuesday: '8:30 AM - 8:00 PM',
      wednesday: '8:30 AM - 8:00 PM',
      thursday: '8:30 AM - 8:00 PM',
      friday: '8:30 AM - 8:00 PM',
      saturday: '9:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM'
    }
  },
  {
    id: 'd4',
    name: 'Valley Ford',
    address: '321 Valley Drive',
    city: 'Van Nuys',
    state: 'CA',
    zip: '91401',
    phone: '(555) 456-7890',
    email: 'info@valleyford.com',
    latitude: 34.1865,
    longitude: -118.4490,
    distance: '5.2 miles',
    rating: 4.5,
    services: ['Sales', 'Service', 'Parts', 'Test Drives', 'Commercial'],
    hours: {
      monday: '9:00 AM - 9:00 PM',
      tuesday: '9:00 AM - 9:00 PM',
      wednesday: '9:00 AM - 9:00 PM',
      thursday: '9:00 AM - 9:00 PM',
      friday: '9:00 AM - 9:00 PM',
      saturday: '9:00 AM - 8:00 PM',
      sunday: '10:00 AM - 7:00 PM'
    }
  },
  {
    id: 'd5',
    name: 'Electric Avenue Tesla',
    address: '555 Future Way',
    city: 'Santa Monica',
    state: 'CA',
    zip: '90401',
    phone: '(555) 567-8901',
    email: 'hello@electricavenue.com',
    latitude: 34.0195,
    longitude: -118.4912,
    distance: '4.7 miles',
    rating: 4.7,
    services: ['Sales', 'Service', 'Test Drives', 'Charging Stations'],
    hours: {
      monday: '10:00 AM - 7:00 PM',
      tuesday: '10:00 AM - 7:00 PM',
      wednesday: '10:00 AM - 7:00 PM',
      thursday: '10:00 AM - 7:00 PM',
      friday: '10:00 AM - 7:00 PM',
      saturday: '10:00 AM - 7:00 PM',
      sunday: '10:00 AM - 6:00 PM'
    }
  }
];

// Generate time slots for the next 14 days
export function generateTimeSlots(dealershipId: string, startDate: Date = new Date()): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const times = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
  ];

  for (let day = 0; day < 14; day++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + day);
    
    // Skip Sundays for some dealerships
    if (date.getDay() === 0 && Math.random() > 0.5) continue;
    
    const dateStr = date.toISOString().split('T')[0];
    
    times.forEach(time => {
      // Randomly mark some slots as unavailable
      const available = Math.random() > 0.3;
      slots.push({
        date: dateStr,
        time,
        available,
        dealershipId
      });
    });
  }
  
  return slots;
}

// Mock appointments (initially empty, will be populated as users book)
export const mockAppointments: Appointment[] = [];

// Helper function to search vehicles
export function searchVehicles(criteria: Partial<Vehicle>): Vehicle[] {
  return mockVehicles.filter(vehicle => {
    if (criteria.make && vehicle.make !== criteria.make) return false;
    if (criteria.model && vehicle.model !== criteria.model) return false;
    if (criteria.type && vehicle.type !== criteria.type) return false;
    if (criteria.year && vehicle.year !== criteria.year) return false;
    if (criteria.available !== undefined && vehicle.available !== criteria.available) return false;
    return true;
  });
}

// Helper function to filter vehicles by price range
export function filterVehiclesByPrice(minPrice?: number, maxPrice?: number): Vehicle[] {
  return mockVehicles.filter(vehicle => {
    if (minPrice && vehicle.price < minPrice) return false;
    if (maxPrice && vehicle.price > maxPrice) return false;
    return true;
  });
}

// Helper function to get vehicle by ID
export function getVehicleById(id: string): Vehicle | undefined {
  return mockVehicles.find(v => v.id === id);
}

// Helper function to get dealership by ID
export function getDealershipById(id: string): Dealership | undefined {
  return mockDealerships.find(d => d.id === id);
}

// Helper function to create a mock appointment
export function createAppointment(data: {
  type: 'test-drive' | 'service' | 'consultation';
  vehicleId?: string;
  dealershipId: string;
  date: string;
  time: string;
  customer: Customer;
  notes?: string;
}): Appointment {
  const appointment: Appointment = {
    id: 'apt-' + Math.random().toString(36).substr(2, 9),
    type: data.type,
    vehicleId: data.vehicleId,
    vehicle: data.vehicleId ? getVehicleById(data.vehicleId) : undefined,
    dealershipId: data.dealershipId,
    dealership: getDealershipById(data.dealershipId),
    date: data.date,
    time: data.time,
    customer: data.customer,
    status: 'confirmed',
    confirmationNumber: 'CONF-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    notes: data.notes,
    createdAt: new Date().toISOString()
  };
  
  mockAppointments.push(appointment);
  return appointment;
}