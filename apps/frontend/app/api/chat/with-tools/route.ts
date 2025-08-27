import { streamText, stepCountIs } from 'ai';
import { openai } from '@ai-sdk/openai';
import { checkAvailability, scheduleAppointment, searchInventory } from '../tools';
import { mockVehicles, mockDealerships } from '@/lib/mock-data';

// Allow streaming responses up to 30 seconds  
export const maxDuration = 30;

// System prompt that teaches the AI about available tools and how to use them
const SYSTEM_PROMPT = `You are Scout, an AI assistant for MotorScout.ai.

You help customers:
- Search for vehicles in our inventory
- Check availability for test drives  
- Schedule appointments (test drives, service, consultations)
- Answer questions about vehicles and dealerships

When helping with scheduling:
1. First help them find a vehicle they're interested in (if for test drive)
2. Use the checkAvailability tool to see available times
3. Collect required customer information (name, email, phone)
4. Use the scheduleAppointment tool to book
5. Provide clear confirmation with the confirmation number

Available Dealerships:
${mockDealerships.map(d => `- ${d.name} (ID: ${d.id}): ${d.address}, ${d.distance}`).join('\n')}

Current Inventory Summary:
- ${mockVehicles.filter(v => v.type === 'SUV').length} SUVs available
- ${mockVehicles.filter(v => v.type === 'Sedan').length} Sedans available  
- ${mockVehicles.filter(v => v.type === 'Electric').length} Electric vehicles
- ${mockVehicles.filter(v => v.type === 'Hybrid').length} Hybrids
- Prices ranging from $${Math.min(...mockVehicles.map(v => v.price)).toLocaleString()} to $${Math.max(...mockVehicles.map(v => v.price)).toLocaleString()}

When discussing vehicles, always mention:
- Year, Make, Model
- Price
- Key features (MPG or range for EVs)
- Availability status
- Vehicle ID when scheduling

Be helpful, conversational, and guide users through the booking process step by step.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing OPENAI_API_KEY' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Filter out any welcome messages from the client
    const filteredMessages = messages.filter(
      (m: any) => !(m.id === 'welcome' && m.role === 'assistant')
    );

    // Use GPT-4o for enhanced reasoning and tool orchestration
    const result = streamText({
      model: openai('gpt-4o'),  // GPT-4o for better tool handling
      system: SYSTEM_PROMPT,
      messages: filteredMessages,
      temperature: 0.7,
      maxOutputTokens: 500,
      tools: {
        checkAvailability,
        scheduleAppointment,
        searchInventory,
      },
      stopWhen: stepCountIs(5), // Allow more steps for GPT-5's reasoning
    });

    // Return the proper UI Message Stream response
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
      message: 'Chat API with tools running - supports scheduling',
      tools: ['checkAvailability', 'scheduleAppointment', 'searchInventory'],
      version: 'v1.0.0'
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}