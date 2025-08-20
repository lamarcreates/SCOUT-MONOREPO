import { OpenAIStream, StreamingTextResponse } from 'ai';

// Allow streaming responses up to 30 seconds  
export const maxDuration = 30;

// System prompt that teaches the AI about available tools
const SYSTEM_PROMPT = `You are Scout, an AI assistant for MotorScout.ai.

You help customers:
- Search for vehicles
- Check availability for test drives  
- Schedule appointments
- Answer questions about inventory

When users ask about vehicles or availability, provide helpful responses based on these example vehicles we have available:

SUVs:
- 2024 Toyota RAV4 Hybrid ($35,990) - AWD, 41/38 MPG, 5 in stock
- 2024 Honda CR-V ($33,450) - AWD, 28/34 MPG, 3 in stock
- 2024 Ford Explorer ($42,870) - 4WD, 3rd row, 21/28 MPG, 2 in stock
- 2024 Mazda CX-5 ($29,900) - AWD, 25/31 MPG, 4 in stock

Sedans/Hybrids:
- 2024 Toyota Camry Hybrid ($28,545) - 51/53 MPG, 6 in stock
- 2024 Honda Accord Hybrid ($32,995) - 48/47 MPG, 3 in stock
- 2024 BMW 330i ($44,295) - xDrive AWD, 26/36 MPG, 2 in stock

Electric Vehicles:
- 2024 Tesla Model 3 ($42,990) - 272 mile range, 4 in stock
- 2024 Tesla Model Y ($52,990) - 310 mile range, AWD, 3 in stock
- 2024 Ford Mustang Mach-E ($45,995) - 250 mile range, AWD, 2 in stock
- 2024 Hyundai Ioniq 5 ($41,450) - 266 mile range, AWD, 3 in stock

Trucks:
- 2024 Ford F-150 Lightning ($62,995) - Electric, 240 mile range, 2 in stock
- 2024 Chevrolet Silverado 1500 ($38,395) - 4WD, 18/24 MPG, 4 in stock

For test drives:
- Available 7 days a week
- Appointments from 9:00 AM to 5:30 PM
- Multiple dealership locations available
- Usually can accommodate same-day or next-day requests

To schedule: Ask for their preferred date/time and contact information.

Be conversational and helpful. If someone asks about specific features or comparisons, provide detailed information.`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemMessage = {
    role: 'system',
    content: SYSTEM_PROMPT
  };

  const allMessages = [systemMessage, ...messages];

  // Call OpenAI
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
      max_tokens: 500,
    }),
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}