'use client';

import { ScoutChat } from '@/components/scout-chat';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ScoutIcon } from '@/components/scout-icon';

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <ScoutIcon className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold text-foreground">MotorScout</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Recommendations
              </Badge>
              <Button variant="outline" asChild>
                <Link href="/browse">Browse Cars</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Chat with Scout AI</h1>
            <p className="text-muted-foreground text-lg">
              Get personalized vehicle recommendations powered by AI
            </p>
          </div>
          
          <ScoutChat />

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <QuickAction
              title="Find My Perfect Car"
              description="Tell me your needs and budget"
              prompt="I'm looking for a reliable family SUV under $40,000"
            />
            <QuickAction
              title="Schedule Test Drive"
              description="Book an appointment"
              prompt="I'd like to schedule a test drive"
            />
            <QuickAction
              title="Compare Vehicles"
              description="Help me choose between options"
              prompt="Can you compare the Toyota RAV4 and Honda CR-V?"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ title, description, prompt }: { title: string; description: string; prompt: string }) {
  return (
    <button
      onClick={() => {
        // This will be connected to the chat later
        // For now, we could emit a custom event that the chat component listens to
        const event = new CustomEvent('scout-chat-prompt', { detail: prompt });
        window.dispatchEvent(event);
      }}
      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors text-left"
    >
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}