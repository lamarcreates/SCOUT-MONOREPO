# Vercel AI SDK + Real-Time Avatar Integration

## ✅ YES - They Work Together Perfectly!

The Vercel AI SDK handles the **text streaming** while the avatar SDK handles the **visual/audio presentation**. They're complementary, not competing technologies.

## Architecture Overview

```
User Input (text/voice)
    ↓
Vercel AI SDK (processes & streams response)
    ↓
Response Stream
    ├── Text Display (chat interface)
    └── Avatar SDK (speaks the response)
```

## Implementation Pattern

### **Option 1: Sequential Integration (Simplest)**

```typescript
import { useChat } from 'ai/react';
import { A2EAvatar } from '@a2e/react-sdk';

export function ScoutAvatarChat() {
  const [isAvatarSpeaking, setIsAvatarSpeaking] = useState(false);
  
  // Vercel AI SDK handles chat logic
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      // When AI finishes generating response, avatar speaks it
      if (message.role === 'assistant') {
        avatarRef.current?.speak(message.content);
      }
    }
  });

  return (
    <div className="chat-with-avatar">
      {/* Avatar Component */}
      <A2EAvatar
        ref={avatarRef}
        onSpeechStart={() => setIsAvatarSpeaking(true)}
        onSpeechEnd={() => setIsAvatarSpeaking(false)}
      />
      
      {/* Chat Interface (Vercel AI SDK) */}
      <div className="chat-panel">
        <MessageList messages={messages} />
        <ChatInput
          value={input}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          disabled={isAvatarSpeaking}
        />
      </div>
    </div>
  );
}
```

### **Option 2: Streaming Integration (Advanced)**

```typescript
import { useChat } from 'ai/react';
import { A2EAvatar } from '@a2e/react-sdk';

export function ScoutStreamingAvatarChat() {
  const avatarRef = useRef<A2EAvatarRef>();
  const [audioBuffer, setAudioBuffer] = useState<string>('');
  
  // Vercel AI SDK with streaming
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      // Stream response chunks to avatar as they arrive
      const reader = response.body?.getReader();
      processStream(reader);
    }
  });

  const processStream = async (reader: ReadableStreamDefaultReader) => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      // Send chunks to avatar for real-time speech
      avatarRef.current?.streamSpeak(chunk);
    }
  };

  return (
    <div className="streaming-avatar-chat">
      <A2EAvatar
        ref={avatarRef}
        streamingMode={true}
        voiceSettings={{
          speed: 1.0,
          pitch: 1.0,
          voice: 'professional-female'
        }}
      />
      <ChatInterface messages={messages} input={input} />
    </div>
  );
}
```

### **Option 3: Voice Input + Avatar Output**

```typescript
import { useChat } from 'ai/react';
import { A2EAvatar } from '@a2e/react-sdk';

export function VoiceEnabledAvatarChat() {
  const [isListening, setIsListening] = useState(false);
  
  // Vercel AI SDK
  const { messages, append } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      if (message.role === 'assistant') {
        playAvatarResponse(message.content);
      }
    }
  });

  // Voice to text (Web Speech API)
  const startListening = () => {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      // Send voice input to Vercel AI SDK
      append({ role: 'user', content: transcript });
    };
    recognition.start();
    setIsListening(true);
  };

  const playAvatarResponse = async (text: string) => {
    // Avatar speaks the AI response
    await avatarRef.current?.speak(text, {
      emotion: detectEmotion(text),
      gestures: true
    });
  };

  return (
    <div className="voice-avatar-chat">
      <A2EAvatar
        ref={avatarRef}
        onListenStart={startListening}
        showListenButton={true}
      />
      <TranscriptDisplay messages={messages} />
      <VoiceButton onClick={startListening} isListening={isListening} />
    </div>
  );
}
```

## Backend Integration

```typescript
// /api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Vercel AI SDK generates the response
  const result = await streamText({
    model: openai('gpt-4'),
    messages,
    // Include avatar instructions in system prompt
    system: `You are Scout, an automotive AI assistant. 
             Keep responses concise for natural speech.
             Use conversational tone suitable for avatar presentation.`,
  });

  // Return streaming response
  return result.toAIStreamResponse({
    // Optional: Include metadata for avatar
    headers: {
      'X-Avatar-Emotion': 'friendly',
      'X-Avatar-Gesture': 'greeting'
    }
  });
}
```

## Complete Architecture Flow

```typescript
// 1. User speaks or types
User Input → 

// 2. Vercel AI SDK processes
useChat() → API Route → LLAMA/OpenAI →

// 3. Response streams back
Streaming Response →

// 4. Dual presentation
├── Text (Chat UI)
└── Avatar (Visual/Audio)
```

## Real-World Implementation Example

```typescript
// Complete MotorScout Avatar Chat Component
export function MotorScoutAvatarChat() {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [showAvatar, setShowAvatar] = useState(true);
  
  // Vercel AI SDK for chat logic
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      { role: 'assistant', content: 'Hi! I\'m Scout, your automotive AI assistant.' }
    ],
    onFinish: async (message) => {
      if (showAvatar && message.role === 'assistant') {
        // Avatar speaks the response
        await speakResponse(message.content);
      }
    }
  });

  const speakResponse = async (text: string) => {
    // Split long responses into sentences for natural speech
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.trim()) {
        await avatarRef.current?.speak(sentence);
      }
    }
  };

  return (
    <div className="motorscout-chat">
      {/* Toggle between avatar and text-only */}
      <ModeToggle 
        showAvatar={showAvatar}
        onToggle={setShowAvatar}
      />
      
      {/* Avatar (optional) */}
      {showAvatar && (
        <A2EAvatar
          ref={avatarRef}
          className="scout-avatar"
          idleAnimation="professional-standing"
          speakingAnimation="professional-explaining"
        />
      )}
      
      {/* Chat powered by Vercel AI SDK */}
      <ChatPanel
        messages={messages}
        input={input}
        onChange={handleInputChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
      
      {/* Voice input option */}
      <VoiceInput
        onTranscript={(text) => {
          append({ role: 'user', content: text });
        }}
      />
    </div>
  );
}
```

## Performance Optimization

### **Reduce Latency:**
```typescript
// Start avatar "thinking" animation while AI generates response
const { handleSubmit } = useChat({
  onSubmit: () => {
    avatarRef.current?.playAnimation('thinking');
  },
  onFinish: (message) => {
    avatarRef.current?.stopAnimation();
    avatarRef.current?.speak(message.content);
  }
});
```

### **Smooth Experience:**
```typescript
// Pre-load avatar responses for common queries
const preloadedResponses = {
  greeting: "Hi! I'm Scout, how can I help you find your perfect vehicle?",
  thinking: "Let me search our inventory for you...",
  scheduling: "I'd be happy to schedule a test drive for you!"
};

// Use immediately while AI generates real response
const handleQuickResponse = (intent: string) => {
  if (preloadedResponses[intent]) {
    avatarRef.current?.speak(preloadedResponses[intent]);
    // Then replace with actual AI response when ready
  }
};
```

## Cost Analysis

### **With Avatar:**
- Vercel AI SDK: Free (just API costs)
- A2E Avatar: ~$0.30 per conversation
- Total: ~$0.30-0.50 per interaction

### **Without Avatar:**
- Vercel AI SDK: Free (just API costs)
- Total: ~$0.02-0.05 per interaction

### **Recommendation:**
- Enable avatar for high-value interactions (serious buyers)
- Text-only for browsing/research phase
- Let users choose their preference

## Common Integration Patterns

### **1. Avatar for Key Moments:**
```typescript
// Only show avatar for important interactions
const shouldShowAvatar = (message: string) => {
  const triggers = ['schedule', 'test drive', 'purchase', 'finance'];
  return triggers.some(trigger => message.toLowerCase().includes(trigger));
};
```

### **2. Emotion Detection:**
```typescript
// Adjust avatar emotion based on context
const getAvatarEmotion = (message: string) => {
  if (message.includes('congratulations')) return 'excited';
  if (message.includes('sorry')) return 'empathetic';
  if (message.includes('great deal')) return 'enthusiastic';
  return 'friendly';
};
```

### **3. Fallback Strategy:**
```typescript
// Graceful degradation if avatar fails
try {
  await avatarRef.current?.speak(message);
} catch (error) {
  console.warn('Avatar unavailable, showing text only');
  // Text chat continues working perfectly
}
```

## FAQ

### **Q: Does the avatar slow down responses?**
A: No! The text appears immediately via Vercel AI SDK streaming. The avatar speaks in parallel.

### **Q: Can I use different avatar providers?**
A: Yes! The pattern works with any avatar SDK (HeyGen, D-ID, Synthesia). Just swap the avatar component.

### **Q: What about mobile?**
A: Avatar can be disabled on mobile to save bandwidth, while chat continues working perfectly.

### **Q: How do they sync?**
A: Vercel AI SDK emits events (onFinish, onResponse) that trigger avatar actions. They're loosely coupled.

## Summary

**YES - Vercel AI SDK + Real-time Avatar work perfectly together!**

- **Vercel AI SDK**: Handles AI logic, streaming, state management
- **Avatar SDK**: Handles visual/audio presentation
- **Together**: Complete conversational AI experience

The Vercel AI SDK actually makes avatar integration EASIER because it handles all the complex streaming logic, letting you focus on the presentation layer.