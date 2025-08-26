import { createUIMessageStreamResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Simple mock response for testing
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Create a properly formatted UI message stream chunk
      const chunk = JSON.stringify({
        type: 'text-delta',
        id: 'test-message',
        delta: 'Hello from Scout AI!'
      }) + '\n';
      
      controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });

  return createUIMessageStreamResponse({ stream });
}