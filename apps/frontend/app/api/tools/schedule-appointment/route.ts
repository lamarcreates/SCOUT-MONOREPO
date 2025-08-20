import { NextResponse } from 'next/server';
import type { AppointmentResponse, AppointmentRequest } from '@scout-workspace/types';
import { createAppointment, getVehicleById, getDealershipById } from '@scout-workspace/utils';

export async function POST(req: Request) {
  try {
    const appointmentData: AppointmentRequest = await req.json();
    
    // Validate required fields
    const errors: string[] = [];
    
    if (!appointmentData.type) errors.push('Appointment type is required');
    if (!appointmentData.dealershipId) errors.push('Dealership is required');
    if (!appointmentData.date) errors.push('Date is required');
    if (!appointmentData.time) errors.push('Time is required');
    if (!appointmentData.customer?.email) errors.push('Customer email is required');
    if (!appointmentData.customer?.phone) errors.push('Customer phone is required');
    if (!appointmentData.customer?.firstName) errors.push('Customer first name is required');
    if (!appointmentData.customer?.lastName) errors.push('Customer last name is required');
    
    if (errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors
        } as AppointmentResponse,
        { status: 400 }
      );
    }
    
    // Validate dealership exists
    const dealership = getDealershipById(appointmentData.dealershipId);
    if (!dealership) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid dealership selected',
          errors: ['Dealership not found']
        } as AppointmentResponse,
        { status: 400 }
      );
    }
    
    // If test drive, validate vehicle exists and is available
    if (appointmentData.type === 'test-drive' && appointmentData.vehicleId) {
      const vehicle = getVehicleById(appointmentData.vehicleId);
      
      if (!vehicle) {
        return NextResponse.json(
          {
            success: false,
            message: 'Vehicle not found',
            errors: ['The selected vehicle is not available']
          } as AppointmentResponse,
          { status: 400 }
        );
      }
      
      if (!vehicle.available || vehicle.stock === 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'Vehicle not available',
            errors: [`The ${vehicle.year} ${vehicle.make} ${vehicle.model} is not currently available for test drives`]
          } as AppointmentResponse,
          { status: 400 }
        );
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
    
    // In a real application, you would:
    // 1. Save to database
    // 2. Send confirmation email to customer
    // 3. Send notification to dealership
    // 4. Create calendar event
    // 5. Send SMS confirmation if requested
    
    // Simulate sending confirmation email
    console.log(`Sending confirmation email to ${appointmentData.customer.email}`);
    console.log(`Appointment confirmed: ${appointment.confirmationNumber}`);
    
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
    
    return NextResponse.json(
      {
        success: true,
        appointment,
        confirmationNumber: appointment.confirmationNumber,
        message: `${successMessage} Confirmation number: ${appointment.confirmationNumber}. A confirmation email has been sent to ${appointmentData.customer.email}.`
      } as AppointmentResponse,
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error scheduling appointment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to schedule appointment',
        errors: ['An unexpected error occurred. Please try again.']
      } as AppointmentResponse,
      { status: 500 }
    );
  }
}