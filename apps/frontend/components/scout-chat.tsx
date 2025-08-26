'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Component to render message content with markdown support
function MessageContent({ content }: { content: string }) {
  return (
    <div className="text-sm">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
          img: ({ src, alt }) => (
            <div className="my-3 flex justify-center">
              <img 
                src={src} 
                alt={alt || 'Vehicle image'} 
                className="rounded-lg max-w-full"
                style={{ 
                  maxWidth: '280px',
                  maxHeight: '200px', 
                  objectFit: 'cover',
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>
          ),
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1 break-words">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} className="text-primary hover:underline break-all" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export function ScoutChat() {
  const [input, setInput] = useState('');
  const initialMessages: UIMessage[] = [
    {
      id: 'welcome',
      role: 'assistant' as const,
      parts: [{ type: 'text' as const, text: 'Hi! I\'m Scout, your automotive AI assistant. I can help you find the perfect vehicle, schedule test drives, or answer any questions about our inventory. How can I help you today?' }]
    },
  ];
  
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    messages: initialMessages,
  });

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const isLoading = status === 'streaming' || status === 'submitted';

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    // Find the actual scrollable viewport element within ScrollArea
    const scrollViewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]');
    if (scrollViewport) {
      scrollViewport.scrollTop = scrollViewport.scrollHeight;
    }
  }, [messages]);

  // Listen for quick action events
  useEffect(() => {
    const handleQuickAction = (event: CustomEvent<string>) => {
      setInput(event.detail);
      // Optionally auto-submit
      setTimeout(() => {
        const form = document.querySelector('form') as HTMLFormElement;
        if (form && event.detail) {
          form.requestSubmit();
        }
      }, 100);
    };

    window.addEventListener('scout-chat-prompt' as any, handleQuickAction);
    return () => {
      window.removeEventListener('scout-chat-prompt' as any, handleQuickAction);
    };
  }, [setInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto overflow-hidden">
      {/* Chat Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">Scout AI Assistant</h2>
            <p className="text-sm text-muted-foreground">Always here to help you find your perfect vehicle</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
              )}
              
              <div
                className={`rounded-lg px-4 py-3 min-w-0 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground max-w-[70%]'
                    : 'bg-muted max-w-[85%]'
                }`}
                style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
              >
                <MessageContent content={message.parts.map(part => part.type === 'text' ? part.text : '').join('')} />
              </div>

              {message.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div className="rounded-lg px-4 py-2 bg-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}

          {error && (
            <div className="text-center text-sm text-destructive">
              Something went wrong. Please try again.
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about vehicles, schedule a test drive, or get recommendations..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}