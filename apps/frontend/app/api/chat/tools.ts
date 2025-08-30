import { tool } from 'ai';
import { z } from 'zod';
import type { Vehicle } from '@/lib/tools-types';

// Tool for checking vehicle availability for test drives
export const checkAvailability = tool({
  description: 'Check availability for test driving a specific vehicle',
  inputSchema: z.object({
    vehicleId: z.string().describe('The ID of the vehicle to check availability for'),
    date: z.string().describe('The date for the test drive in YYYY-MM-DD format'),
    time: z.string().optional().describe('Preferred time in HH:MM AM/PM format (optional)'),
    dealershipId: z.string().optional().describe('Specific dealership ID (optional)'),
  }),
  execute: async ({ vehicleId, date, time, dealershipId }) => {
    const { getVehicleById, getDealershipById } = await import('@/lib/mock-data');
    
    try {
      // Validate vehicle exists and is available
      const vehicle = getVehicleById(vehicleId);
      
      if (!vehicle) {
        return {
          available: false,
          message: 'Vehicle not found in our inventory.',
          error: true
        };
      }
      
      if (!vehicle.available || vehicle.stock === 0) {
        return {
          available: false,
          message: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is not currently available for test drives.`,
          vehicle
        };
      }
      
      // Generate available time slots
      const availableSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', 
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ];
      
      // If a specific time was requested, check if it's available
      if (time) {
        const isSlotAvailable = availableSlots.some(slot => 
          slot.toLowerCase() === time.toLowerCase()
        );
        
        if (!isSlotAvailable) {
          return {
            available: true,
            requestedTime: time,
            availableSlots,
            message: `The requested time ${time} is not available. Please choose from the available slots.`,
            vehicle,
            dealershipId: dealershipId || 'd1'
          };
        }
        
        return {
          available: true,
          confirmedTime: time,
          message: `Great! The ${vehicle.year} ${vehicle.make} ${vehicle.model} is available for a test drive on ${date} at ${time}.`,
          vehicle,
          dealershipId: dealershipId || 'd1'
        };
      }
      
      // Return available slots if no time specified
      return {
        available: true,
        availableSlots,
        message: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is available for test drives on ${date}. Please select a time slot.`,
        vehicle,
        dealershipId: dealershipId || 'd1'
      };
      
    } catch (error) {
      console.error('Error checking availability:', error);
      return {
        available: false,
        message: 'Failed to check availability. Please try again.',
        error: true
      };
    }
  },
});

// Tool for scheduling an appointment
export const scheduleAppointment = tool({
  description: 'Schedule a test drive, service appointment, or consultation',
  inputSchema: z.object({
    type: z.enum(['test-drive', 'service', 'consultation']).describe('Type of appointment'),
    vehicleId: z.string().optional().describe('Vehicle ID for test drives'),
    dealershipId: z.string().describe('Dealership ID where appointment will be'),
    date: z.string().describe('Appointment date in YYYY-MM-DD format'),
    time: z.string().describe('Appointment time in HH:MM AM/PM format'),
    customer: z.object({
      firstName: z.string().describe('Customer first name'),
      lastName: z.string().describe('Customer last name'),
      email: z.string().email().describe('Customer email address'),
      phone: z.string().describe('Customer phone number'),
    }).describe('Customer contact information'),
    notes: z.string().optional().describe('Additional notes or special requests'),
  }),
  execute: async (appointmentData) => {
    const { createAppointment, getVehicleById, getDealershipById } = await import('@/lib/mock-data');
    
    try {
      // Validate dealership exists
      const dealership = getDealershipById(appointmentData.dealershipId);
      if (!dealership) {
        return {
          success: false,
          message: 'Invalid dealership selected',
          error: true
        };
      }
      
      // If test drive, validate vehicle exists and is available
      if (appointmentData.type === 'test-drive' && appointmentData.vehicleId) {
        const vehicle = getVehicleById(appointmentData.vehicleId);
        
        if (!vehicle) {
          return {
            success: false,
            message: 'Vehicle not found',
            error: true
          };
        }
        
        if (!vehicle.available || vehicle.stock === 0) {
          return {
            success: false,
            message: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is not currently available for test drives`,
            error: true
          };
        }
      }
      
      // Create the appointment
      const appointment = createAppointment({
        type: appointmentData.type,
        vehicleId: appointmentData.vehicleId,
        dealershipId: appointmentData.dealershipId,
        date: appointmentData.date,
        time: appointmentData.time,
        customer: appointmentData.customer,
        notes: appointmentData.notes
      });
      
      // Build success message based on appointment type
      let successMessage = '';
      switch (appointmentData.type) {
        case 'test-drive':
          const vehicle = appointment.vehicle;
          successMessage = vehicle 
            ? `Your test drive for the ${vehicle.year} ${vehicle.make} ${vehicle.model} has been confirmed for ${appointmentData.date} at ${appointmentData.time} at ${dealership.name}.`
            : `Your test drive has been confirmed for ${appointmentData.date} at ${appointmentData.time} at ${dealership.name}.`;
          break;
        case 'service':
          successMessage = `Your service appointment has been confirmed for ${appointmentData.date} at ${appointmentData.time} at ${dealership.name}.`;
          break;
        case 'consultation':
          successMessage = `Your consultation has been confirmed for ${appointmentData.date} at ${appointmentData.time} at ${dealership.name}.`;
          break;
      }
      
      return {
        success: true,
        appointment,
        confirmationNumber: appointment.confirmationNumber,
        message: `${successMessage} Confirmation number: ${appointment.confirmationNumber}. A confirmation email has been sent to ${appointmentData.customer.email}.`
      };
      
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      return {
        success: false,
        message: 'Failed to schedule appointment. Please try again.',
        error: true
      };
    }
  },
});

// Tool for searching vehicle inventory (already being used for general queries)
export const searchInventory = tool({
  description: 'Search for vehicles in the inventory based on criteria and optional location',
  inputSchema: z.object({
    query: z.string().optional().describe('Free text like "2022 Toyota hybrid"'),
    type: z.string().optional().describe('SUV, Sedan, Truck, Electric, Hybrid, Coupe, Minivan'),
    priceMin: z.number().optional().describe('Minimum price'),
    priceMax: z.number().optional().describe('Maximum price'),
    make: z.string().optional().describe('Vehicle make/brand'),
    model: z.string().optional().describe('Vehicle model'),
    yearMin: z.number().optional().describe('Minimum model year'),
    yearMax: z.number().optional().describe('Maximum model year'),
    location: z.string().optional().describe('City, state, or address (e.g., "Chantilly, VA")'),
    zip: z.string().optional().describe('ZIP code'),
    latitude: z.number().optional().describe('Latitude if known'),
    longitude: z.number().optional().describe('Longitude if known'),
    radiusMiles: z.number().optional().describe('Search radius in miles (default 25)')
  }),
  execute: async (searchParams) => {
    const PROVIDER = process.env.LISTINGS_PROVIDER || 'marketcheck';

    async function geocodeIfNeeded(): Promise<{ lat?: number; lon?: number }> {
      if (typeof searchParams.latitude === 'number' && typeof searchParams.longitude === 'number') {
        return { lat: searchParams.latitude, lon: searchParams.longitude };
      }
      if (!searchParams.location) return {};
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchParams.location)}`;
        const res = await fetch(url, { headers: { 'User-Agent': 'ScoutApp/1.0 (contact@example.com)' } });
        if (!res.ok) return {};
        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) return {};
        const best = data[0];
        return { lat: parseFloat(best.lat), lon: parseFloat(best.lon) };
      } catch {
        return {};
      }
    }

    async function fetchProvider(): Promise<Vehicle[]> {
      // Derive zip from numeric location like "20850"
      if (!searchParams.zip && typeof searchParams.location === 'string' && /^\d{5}$/.test(searchParams.location.trim())) {
        searchParams.zip = searchParams.location.trim();
      }
      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:4200');
      const res = await fetch(`${baseUrl}/api/tools/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: searchParams.make,
          model: searchParams.model,
          yearMin: searchParams.yearMin,
          yearMax: searchParams.yearMax,
          priceMin: searchParams.priceMin,
          priceMax: searchParams.priceMax,
          location: searchParams.location,
          zip: searchParams.zip,
          latitude: searchParams.latitude,
          longitude: searchParams.longitude,
          radiusMiles: searchParams.radiusMiles,
          limit: 50
        })
      });
      if (!res.ok) throw new Error(`Provider error ${res.status}`);
      const data = await res.json();
      return Array.isArray(data?.vehicles) ? data.vehicles : [];
    }

    try {
      let source: 'marketcheck' | 'mock' = 'marketcheck';
      let vehicles: Vehicle[] = [];
      if (PROVIDER) {
        try {
          vehicles = await fetchProvider();
          console.log('[searchInventory] provider returned', vehicles.length, 'items for', {
            make: searchParams.make, model: searchParams.model, priceMin: searchParams.priceMin, priceMax: searchParams.priceMax, location: searchParams.location, zip: searchParams.zip
          });
          if (vehicles.length > 0) source = 'marketcheck';
        } catch (e) {
          console.error('Listings provider fetch failed:', e);
        }
      }
      // Only fall back to mock data if explicitly allowed via env
      const allowMockFallback = process.env.ALLOW_MOCK_FALLBACK === 'true' || !PROVIDER;
      if (vehicles.length === 0 && allowMockFallback) {
        const { mockVehicles } = await import('@/lib/mock-data');
        vehicles = [...mockVehicles];
        source = 'mock';
      }

      // Local filtering to refine results
      if (searchParams.make) {
        vehicles = vehicles.filter(v => v.make.toLowerCase().includes(searchParams.make!.toLowerCase()));
      }
      if (searchParams.model) {
        vehicles = vehicles.filter(v => v.model.toLowerCase().includes(searchParams.model!.toLowerCase()));
      }
      if (searchParams.query) {
        const q = searchParams.query.toLowerCase();
        vehicles = vehicles.filter(v => `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(q) || v.type.toLowerCase().includes(q));
      }
      if (searchParams.type) {
        vehicles = vehicles.filter(v => v.type.toLowerCase() === searchParams.type!.toLowerCase());
      }
      if (searchParams.priceMin) {
        vehicles = vehicles.filter(v => v.price >= searchParams.priceMin!);
      }
      if (searchParams.priceMax) {
        vehicles = vehicles.filter(v => v.price <= searchParams.priceMax!);
      }
      if (searchParams.yearMin) {
        vehicles = vehicles.filter(v => v.year >= searchParams.yearMin!);
      }
      if (searchParams.yearMax) {
        vehicles = vehicles.filter(v => v.year <= searchParams.yearMax!);
      }
      // Optional location radius filter after geocoding
      const { lat, lon } = await geocodeIfNeeded();
      if (lat !== undefined && lon !== undefined && (searchParams.radiusMiles ?? 0) > 0) {
        const toRad = (deg: number) => deg * Math.PI / 180;
        const R = 3958.8; // miles
        vehicles = vehicles.filter(v => {
          if (typeof v.latitude !== 'number' || typeof v.longitude !== 'number') return true;
          const dLat = toRad(v.latitude - lat);
          const dLon = toRad(v.longitude - lon);
          const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat)) * Math.cos(toRad(v.latitude)) * Math.sin(dLon/2) ** 2;
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const dist = R * c;
          return dist <= (searchParams.radiusMiles ?? 25);
        });
      }

      // Sort by availability, stock, then price
      vehicles.sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        if (a.stock > b.stock) return -1;
        if (a.stock < b.stock) return 1;
        return a.price - b.price;
      });

      const limited = vehicles.slice(0, 10);
      let message = '';
      if (vehicles.length === 0) message = 'No vehicles found matching your criteria.';
      else if (vehicles.length === 1) {
        const v = vehicles[0];
        message = `Found 1 vehicle: ${v.year} ${v.make} ${v.model} for $${v.price.toLocaleString()}`;
      } else {
        const prices = vehicles.map(v => v.price);
        const minP = Math.min(...prices);
        const maxP = Math.max(...prices);
        message = `Found ${vehicles.length} vehicles` + (isFinite(minP) && isFinite(maxP) && minP !== maxP ? ` from $${minP.toLocaleString()} to $${maxP.toLocaleString()}` : '');
      }

      return { vehicles: limited, total: vehicles.length, message, source };
    } catch (error) {
      console.error('Error searching inventory:', error);
      return { vehicles: [], message: 'Failed to search inventory. Please try again.', error: true };
    }
  },
});
