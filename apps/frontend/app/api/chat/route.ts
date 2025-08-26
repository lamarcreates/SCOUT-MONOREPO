import { streamText, convertToCoreMessages, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import {
  getVehicleById,
  getDealershipById,
  generateTimeSlots,
  mockDealerships,
  createAppointment,
} from '@/lib/mock-data';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages = [] } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Missing OPENAI_API_KEY server configuration.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Filter out the static UI welcome message to avoid polluting context
  const filteredMessages = messages.filter(
    (m: any) => !(m.id === 'welcome' && m.role === 'assistant')
  );

  const systemMessage = {
    role: 'system' as const,
    content:
      'You are Scout, an AI assistant for Scout. Help users find vehicles and schedule appointments. When availability or booking is requested, use the provided tools. Keep responses concise, friendly, and include vehicle images in markdown when specifically discussing a vehicle.'
  };

  const modelName = process.env.AI_MODEL || 'gpt-4o-mini';

  const result = await streamText({
    model: openai(modelName) as any,
    messages: convertToCoreMessages([systemMessage, ...filteredMessages]),
    temperature: 0.7,
    tools: {
      checkAvailability: tool({
        description: 'Check test-drive availability for a vehicle on a date (and optional time).',
        parameters: z.object({
          vehicleId: z.string().describe('Vehicle ID (e.g., v3)'),
          date: z.string().describe('Date in YYYY-MM-DD format'),
          time: z.string().optional().describe('Optional time, e.g., 10:30 AM'),
          dealershipId: z.string().optional().describe('Optional dealership ID'),
        }),
        execute: async ({ vehicleId, date, time, dealershipId }) => {
          const vehicle = getVehicleById(vehicleId);
          if (!vehicle) {
            return { available: false, message: 'Vehicle not found', slots: [], dealerships: [] };
          }
          if (!vehicle.available || vehicle.stock === 0) {
            return {
              available: false,
              vehicle,
              slots: [],
              dealerships: [],
              message: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is currently not available for test drives.`,
            };
          }

          const availableDealerships = dealershipId
            ? mockDealerships.filter((d) => d.id === dealershipId)
            : mockDealerships.filter((d) => d.services.includes('Test Drives'));

          const allSlots: any[] = [];
          const requestedDate = new Date(date);
          for (const d of availableDealerships) {
            const slots = generateTimeSlots(d.id, requestedDate);
            const filtered = slots.filter((s) => {
              if (s.date !== date) return false;
              if (time && s.time !== time) return false;
              return s.available;
            });
            allSlots.push(...filtered.slice(0, 5));
          }

          if (time) {
            const specificSlot = allSlots.find((s) => s.time === time);
            if (specificSlot) {
              return {
                available: true,
                vehicle,
                slots: [specificSlot],
                dealerships: availableDealerships,
                message: `Great news! The ${vehicle.year} ${vehicle.make} ${vehicle.model} is available for a test drive on ${date} at ${time}.`,
              };
            }
            return {
              available: true,
              vehicle,
              slots: allSlots.slice(0, 6),
              dealerships: availableDealerships,
              message: `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is not available at ${time} on ${date}, but here are some alternative times.`,
            };
          }

          return {
            available: allSlots.length > 0,
            vehicle,
            slots: allSlots.slice(0, 8),
            dealerships: availableDealerships,
            message:
              allSlots.length > 0
                ? `The ${vehicle.year} ${vehicle.make} ${vehicle.model} is available for test drives on ${date}. Here are the available times.`
                : `Unfortunately, there are no available slots on ${date}. Would you like to try a different date?`,
          };
        },
      }),

      scheduleAppointment: tool({
        description: 'Schedule an appointment (test-drive, service, or consultation).',
        parameters: z.object({
          type: z.enum(['test-drive', 'service', 'consultation']),
          vehicleId: z.string().optional(),
          dealershipId: z.string(),
          date: z.string(),
          time: z.string(),
          customer: z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            phone: z.string(),
            preferredContact: z.enum(['email', 'phone', 'text']).optional(),
          }),
          notes: z.string().optional(),
        }),
        execute: async (args) => {
          const errors: string[] = [];
          if (!args.type) errors.push('Appointment type is required');
          if (!args.dealershipId) errors.push('Dealership is required');
          if (!args.date) errors.push('Date is required');
          if (!args.time) errors.push('Time is required');
          if (!args.customer?.email) errors.push('Customer email is required');
          if (!args.customer?.phone) errors.push('Customer phone is required');
          if (!args.customer?.firstName) errors.push('Customer first name is required');
          if (!args.customer?.lastName) errors.push('Customer last name is required');

          if (errors.length > 0) {
            return { success: false, message: 'Validation failed', errors };
          }

          const dealership = getDealershipById(args.dealershipId);
          if (!dealership) {
            return { success: false, message: 'Invalid dealership selected', errors: ['Dealership not found'] };
          }

          if (args.type === 'test-drive' && args.vehicleId) {
            const vehicle = getVehicleById(args.vehicleId);
            if (!vehicle) {
              return { success: false, message: 'Vehicle not found', errors: ['The selected vehicle is not available'] };
            }
            if (!vehicle.available || vehicle.stock === 0) {
              return {
                success: false,
                message: 'Vehicle not available',
                errors: [`The ${vehicle.year} ${vehicle.make} ${vehicle.model} is not currently available for test drives`],
              };
            }
          }

          const appointment = createAppointment({
            type: args.type,
            vehicleId: args.vehicleId,
            dealershipId: args.dealershipId,
            date: args.date,
            time: args.time,
            customer: args.customer,
            notes: args.notes,
          });

          const vehicle = appointment.vehicle;
          let successMessage = '';
          switch (args.type) {
            case 'test-drive':
              successMessage = vehicle
                ? `Your test drive for the ${vehicle.year} ${vehicle.make} ${vehicle.model} has been confirmed for ${args.date} at ${args.time} at ${dealership!.name}.`
                : `Your test drive has been confirmed for ${args.date} at ${args.time} at ${dealership!.name}.`;
              break;
            case 'service':
              successMessage = `Your service appointment has been confirmed for ${args.date} at ${args.time} at ${dealership!.name}.`;
              break;
            case 'consultation':
              successMessage = `Your consultation has been confirmed for ${args.date} at ${args.time} at ${dealership!.name}.`;
              break;
          }

          return {
            success: true,
            appointment,
            confirmationNumber: appointment.confirmationNumber,
            message: `${successMessage} Confirmation number: ${appointment.confirmationNumber}. A confirmation email has been sent to ${args.customer.email}.`,
          };
        },
      }),
    },
  });

  return result.toAIStreamResponse();
}
