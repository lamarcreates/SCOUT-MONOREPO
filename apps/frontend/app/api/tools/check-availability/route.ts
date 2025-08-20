import { NextResponse } from 'next/server';
import type { AvailabilityResponse } from '@scout-workspace/types';
import { 
  getVehicleById, 
  getDealershipById, 
  generateTimeSlots,
  mockDealerships 
} from '@scout-workspace/utils';

export async function POST(req: Request) {
  try {
    const { vehicleId, date, time, dealershipId } = await req.json();
    
    // Validate input
    if (!vehicleId || !date) {
      return NextResponse.json(
        { error: 'Vehicle ID and date are required' },
        { status: 400 }
      );
    }
    
    // Get vehicle details
    const vehicle = getVehicleById(vehicleId);
    
    if (!vehicle) {
      return NextResponse.json(
        { 
          available: false,
          message: 'Vehicle not found',
          slots: [],
          dealerships: []
        } as AvailabilityResponse,
        { status: 200 }
      );
    }
    
    // If vehicle is not available at all
    if (!vehicle.available || vehicle.stock === 0) {
      return NextResponse.json(
        {
          available: false,
          vehicle,
          message: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is currently not available for test drives.`,
          slots: [],
          dealerships: []
        } as AvailabilityResponse,
        { status: 200 }
      );
    }
    
    // Get dealerships that have this vehicle
    const availableDealerships = dealershipId 
      ? mockDealerships.filter(d => d.id === dealershipId)
      : mockDealerships.filter(d => 
          // In real app, check which dealerships have this vehicle in stock
          d.services.includes('Test Drives')
        );
    
    // Generate available time slots for each dealership
    const allSlots = [];
    const requestedDate = new Date(date);
    
    for (const dealership of availableDealerships) {
      const slots = generateTimeSlots(dealership.id, requestedDate);
      
      // Filter to requested date and optionally time
      const filteredSlots = slots.filter(slot => {
        if (slot.date !== date) return false;
        if (time && slot.time !== time) return false;
        return slot.available;
      });
      
      allSlots.push(...filteredSlots.slice(0, 5)); // Limit to 5 slots per dealership
    }
    
    // Check if specific time was requested
    if (time) {
      const specificSlot = allSlots.find(slot => slot.time === time);
      
      if (specificSlot) {
        return NextResponse.json(
          {
            available: true,
            vehicle,
            slots: [specificSlot],
            dealerships: availableDealerships,
            message: `Great news! The ${vehicle.year} ${vehicle.make} ${vehicle.model} is available for a test drive on ${date} at ${time}.`
          } as AvailabilityResponse,
          { status: 200 }
        );
      } else {
        // Suggest alternative times
        return NextResponse.json(
          {
            available: true,
            vehicle,
            slots: allSlots.slice(0, 6),
            dealerships: availableDealerships,
            message: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is not available at ${time} on ${date}, but here are some alternative times.`
          } as AvailabilityResponse,
          { status: 200 }
        );
      }
    }
    
    // Return general availability for the date
    return NextResponse.json(
      {
        available: allSlots.length > 0,
        vehicle,
        slots: allSlots.slice(0, 8), // Return up to 8 available slots
        dealerships: availableDealerships,
        message: allSlots.length > 0 
          ? `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is available for test drives on ${date}. Here are the available times.`
          : `Unfortunately, there are no available slots for the ${vehicle.year} ${vehicle.make} ${vehicle.model} on ${date}. Would you like to try a different date?`
      } as AvailabilityResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}