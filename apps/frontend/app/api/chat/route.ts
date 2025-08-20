import { OpenAIStream, StreamingTextResponse } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Add system message to the beginning of messages if not present
  const systemMessage = {
    role: 'system',
    content: `You are Scout, an AI assistant for MotorScout.ai, an automotive dealership platform. 
    You help customers find their perfect vehicle, schedule test drives, and answer questions about inventory.
    Be friendly, knowledgeable, and focused on helping customers make informed decisions.
    Keep responses concise and conversational.`
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