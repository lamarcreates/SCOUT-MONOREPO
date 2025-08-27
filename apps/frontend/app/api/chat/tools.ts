import { tool } from 'ai';
import { z } from 'zod';

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
  description: 'Search for vehicles in the inventory based on criteria',
  inputSchema: z.object({
    query: z.string().optional().describe('Search query or keywords'),
    type: z.string().optional().describe('Vehicle type (SUV, Sedan, Truck, Electric, Hybrid, Coupe, Minivan)'),
    priceMin: z.number().optional().describe('Minimum price'),
    priceMax: z.number().optional().describe('Maximum price'),
    make: z.string().optional().describe('Vehicle make/brand'),
    model: z.string().optional().describe('Vehicle model'),
  }),
  execute: async (searchParams) => {
    // Import mock data directly instead of making HTTP call
    const { mockVehicles } = await import('@/lib/mock-data');
    
    try {
      // Start with all vehicles
      let filteredVehicles = [...mockVehicles];
      
      // Apply filters
      if (searchParams.make) {
        filteredVehicles = filteredVehicles.filter(v => 
          v.make.toLowerCase().includes(searchParams.make!.toLowerCase())
        );
      }
      
      if (searchParams.model) {
        filteredVehicles = filteredVehicles.filter(v => 
          v.model.toLowerCase().includes(searchParams.model!.toLowerCase())
        );
      }
      
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase();
        filteredVehicles = filteredVehicles.filter(v => 
          `${v.year} ${v.make} ${v.model}`.toLowerCase().includes(query) ||
          v.type.toLowerCase().includes(query)
        );
      }
      
      if (searchParams.type) {
        filteredVehicles = filteredVehicles.filter(v => 
          v.type.toLowerCase() === searchParams.type!.toLowerCase()
        );
      }
      
      if (searchParams.priceMin) {
        filteredVehicles = filteredVehicles.filter(v => v.price >= searchParams.priceMin!);
      }
      
      if (searchParams.priceMax) {
        filteredVehicles = filteredVehicles.filter(v => v.price <= searchParams.priceMax!);
      }
      
      // Sort by availability and stock
      filteredVehicles.sort((a, b) => {
        if (a.available && !b.available) return -1;
        if (!a.available && b.available) return 1;
        if (a.stock > b.stock) return -1;
        if (a.stock < b.stock) return 1;
        return a.price - b.price;
      });
      
      // Limit results for chat context
      const limitedVehicles = filteredVehicles.slice(0, 10);
      
      // Build response message
      let message = '';
      if (filteredVehicles.length === 0) {
        message = 'No vehicles found matching your criteria.';
      } else if (filteredVehicles.length === 1) {
        const v = filteredVehicles[0];
        message = `Found 1 vehicle: ${v.year} ${v.make} ${v.model} for $${v.price.toLocaleString()}`;
      } else {
        message = `Found ${filteredVehicles.length} vehicles matching your criteria`;
      }
      
      return {
        vehicles: limitedVehicles,
        total: filteredVehicles.length,
        message
      };
    } catch (error) {
      console.error('Error searching inventory:', error);
      return {
        vehicles: [],
        message: 'Failed to search inventory. Please try again.',
        error: true
      };
    }
  },
});