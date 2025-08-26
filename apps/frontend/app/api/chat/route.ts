import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Allow streaming responses up to 30 seconds  
export const maxDuration = 30;

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

    // Use streamText from AI SDK v5
    const result = streamText({
      model: openai('gpt-3.5-turbo'),
      system: 'You are Scout, an AI assistant for MotorScout.ai automotive dealership. Help users find vehicles, schedule test drives, and answer questions about inventory. Be friendly, helpful, and concise.',
      messages: filteredMessages,
      temperature: 0.7,
    });

    // In v5, we need to manually create a streaming response from the text stream
    const { textStream } = result;
    const stream = new ReadableStream({
      async start(controller) {
        for await (const text of textStream) {
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });
    
    return new Response(stream, {
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
    
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
      message: 'Chat API running with AI SDK v5',
      version: 'v5.0.25'
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}