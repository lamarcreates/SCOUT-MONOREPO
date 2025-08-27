import { streamText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { mockVehicles, mockDealerships } from '@/lib/mock-data';
import { checkAvailability, scheduleAppointment, searchInventory } from './tools';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Allow streaming responses up to 30 seconds  
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing OPENAI_API_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Filter out any welcome messages from the client
    const filteredMessages = messages && messages.length > 0 
      ? messages.filter((m: any) => !(m.id === 'welcome' && m.role === 'assistant'))
      : [];

    console.log('Received messages:', JSON.stringify(messages, null, 2));
    console.log('Filtered messages:', JSON.stringify(filteredMessages, null, 2));

    // Create a detailed vehicle inventory list with images
    const vehicleList = mockVehicles.slice(0, 15).map(v => 
      `- ${v.year} ${v.make} ${v.model} (ID: ${v.id}) - $${v.price.toLocaleString()} - ${v.type}, ${
        v.mpg ? `${v.mpg.city}/${v.mpg.highway} MPG` : `${v.range} mile range`
      }, ${v.stock} in stock, Image: ${v.image}`
    ).join('\n');

    const dealershipList = mockDealerships.map(d =>
      `- ${d.name} (${d.distance}) - ${d.services.join(', ')}`
    ).join('\n');

    // Build comprehensive system prompt with inventory
    const systemPrompt = `You are Scout, an AI assistant for MotorScout.ai, an automotive dealership platform.
    
You help customers find their perfect vehicle, schedule test drives, and answer questions about inventory.

SCHEDULING CAPABILITIES:
You can now help customers:
1. Check availability for test drives using the checkAvailability tool
2. Schedule appointments using the scheduleAppointment tool
3. Search inventory using the searchInventory tool

When helping with scheduling:
- First help them find a vehicle they're interested in
- Use checkAvailability to see available times
- Collect customer information (name, email, phone)
- Use scheduleAppointment to book
- Provide confirmation number

CURRENT INVENTORY:
${vehicleList}

DEALERSHIP LOCATIONS:
${dealershipList}

TEST DRIVE AVAILABILITY:
- Available 7 days a week
- Appointments from 9:00 AM to 5:30 PM  
- Can usually accommodate same-day or next-day requests
- Multiple time slots available

When users ask about:
- Vehicles: Share specific models from our inventory with prices and features
- Test drives: Use the checkAvailability tool to find open slots
- Booking: Use the scheduleAppointment tool to confirm bookings
- Comparisons: Compare specific vehicles from our inventory
- Images: When discussing specific vehicles, include their images using markdown: ![Vehicle Name](image_url)

IMPORTANT: When showing vehicles to users:
1. Always include the vehicle image using markdown format: ![2024 Toyota RAV4](image_url)
2. Include the vehicle ID when discussing scheduling
3. Place images after describing the vehicle for better visual flow

Be friendly, knowledgeable, and guide customers through the booking process step by step.
Keep responses concise and conversational.`;

    // Convert UIMessages to ModelMessages and use streamText with tools
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      system: systemPrompt,
      messages: filteredMessages,
      temperature: 0.7,
      maxOutputTokens: 500,
      tools: {
        checkAvailability,
        scheduleAppointment,
        searchInventory,
      },
      stopWhen: stepCountIs(3), // Allow multiple tool calls in sequence
    });

    // Return the proper UI Message Stream response for useChat hook
    return result.toUIMessageStreamResponse();
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle GET for debugging
export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'ok',
      message: 'Chat API running with AI SDK v5 and vehicle inventory',
      version: 'v5.0.25'
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}