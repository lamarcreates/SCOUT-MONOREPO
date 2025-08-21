import { OpenAIStream, StreamingTextResponse } from 'ai';
import { mockVehicles, mockDealerships } from '@/lib/mock-data';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Create a detailed system message with our actual inventory
  const vehicleList = mockVehicles.slice(0, 15).map(v => 
    `- ${v.year} ${v.make} ${v.model} (ID: ${v.id}) - $${v.price.toLocaleString()} - ${v.type}, ${
      v.mpg ? `${v.mpg.city}/${v.mpg.highway} MPG` : `${v.range} mile range`
    }, ${v.stock} in stock, Image: ${v.image}`
  ).join('\n');

  const dealershipList = mockDealerships.map(d =>
    `- ${d.name} (${d.distance}) - ${d.services.join(', ')}`
  ).join('\n');

  // Add system message with real inventory data
  const systemMessage = {
    role: 'system',
    content: `You are Scout, an AI assistant for MotorScout.ai, an automotive dealership platform.
    
You help customers find their perfect vehicle, schedule test drives, and answer questions about inventory.

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
- Test drives: Offer to help schedule, ask for preferred date/time
- Comparisons: Compare specific vehicles from our inventory
- Availability: Confirm we have vehicles in stock and can schedule test drives
- Images: When discussing specific vehicles, include their images using markdown: ![Vehicle Name](image_url)

IMPORTANT: When showing vehicles to users:
1. Always include the vehicle image using markdown format: ![2024 Toyota RAV4](image_url)
2. You can show multiple vehicle images when comparing or listing options
3. Place images after describing the vehicle for better visual flow

Be friendly, knowledgeable, and focused on helping customers make informed decisions.
Keep responses concise and conversational.
Use the actual inventory data provided above, including images when relevant.`
  };

  const allMessages = [systemMessage, ...messages];

  // For now, we'll use OpenAI. Later we'll route to on-prem LLAMA
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: allMessages,
      temperature: 0.7,
      stream: true,
    }),
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}