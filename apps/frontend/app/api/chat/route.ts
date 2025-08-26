import { OpenAIStream, StreamingTextResponse } from 'ai';

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

    // Call OpenAI API directly
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are Scout, an AI assistant for an automotive dealership. Help users find vehicles and schedule test drives.'
          },
          ...messages
        ],
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API error', status: response.status }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert response to stream
    const stream = OpenAIStream(response);
    
    // Return streaming response
    return new StreamingTextResponse(stream);
    
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Handle GET for debugging
export async function GET() {
  return new Response(
    JSON.stringify({ 
      status: 'ok',
      message: 'Chat API is running'
    }),
    { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    }
  );
}