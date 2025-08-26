import { StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // Simple mock response for testing
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode('Hello from Scout AI!'));
      controller.close();
    },
  });

  return new StreamingTextResponse(stream);
}
