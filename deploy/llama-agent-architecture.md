# Scout AI Agent Architecture with On-Prem LLAMA 70B

## The Challenge
Your LLAMA 70B is the brain of Scout, but it's on-prem. Users worldwide need fast, reliable access.

## Solution Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     User (Anywhere)                          │
└────────────────────┬─────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                Vercel Frontend (Global CDN)                  │
│                     scout.vercel.app                         │
└────────────────────┬─────────────────────────────────────────┘
                     │ WebSocket/HTTPS
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                 AWS EC2 (API Gateway)                        │
│                    t3.xlarge/t3.2xlarge                      │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │            Scout Backend (Fastify)                   │    │
│  │                                                      │    │
│  │  • Request Router                                    │    │
│  │  • Session Management                                │    │
│  │  • Response Streaming                                │    │
│  │  • Fallback Logic                                    │    │
│  │  • Cache Layer                                       │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────┬─────────────────────────────────────────┘
                     │ Tailscale Private Network
                     ▼
┌──────────────────────────────────────────────────────────────┐
│              On-Prem AI Cluster (Primary)                    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         LLAMA 70B (Main Scout Agent)                │    │
│  │                                                      │    │
│  │  • Vehicle recommendations                           │    │
│  │  • Customer conversations                            │    │
│  │  • Appointment scheduling                            │    │
│  │  • Inventory analysis                                │    │
│  │  • Trained on dealership data                        │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  Running on: Your GPU cluster                                │
│  Access: Tailscale IP (100.x.x.x:8080)                      │
└──────────────────────────────────────────────────────────────┘
                     │ Fallback (if on-prem down)
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                 OpenAI GPT-4 (Backup)                        │
└──────────────────────────────────────────────────────────────┘
```

## Implementation Strategy

### 1. Primary Flow (99% of requests)

```javascript
// apps/backend/src/services/scout-agent.service.ts

class ScoutAgentService {
  private tailscaleEndpoint = 'http://100.101.102.6:8080';
  private healthCheckInterval = 30000; // 30 seconds
  private isOnPremAvailable = true;

  constructor() {
    // Monitor on-prem health
    setInterval(() => this.checkOnPremHealth(), this.healthCheckInterval);
  }

  async chat(userId: string, message: string, context: any) {
    try {
      // Primary: Use on-prem LLAMA
      if (this.isOnPremAvailable) {
        return await this.callOnPremLLAMA(message, context);
      }
      
      // Fallback: Use OpenAI
      console.warn('On-prem unavailable, using OpenAI fallback');
      return await this.callOpenAI(message, context);
      
    } catch (error) {
      // Emergency fallback
      return this.getCachedResponse(message) || 
             this.getStaticResponse(message);
    }
  }

  private async callOnPremLLAMA(message: string, context: any) {
    const response = await fetch(`${this.tailscaleEndpoint}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ONPREM_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-70b-scout',
        messages: [
          {
            role: 'system',
            content: `You are Scout, an AI assistant for a car dealership. 
                     You help customers find vehicles, schedule appointments, 
                     and answer questions about inventory.`
          },
          ...context.previousMessages,
          { role: 'user', content: message }
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    // Stream response back to user
    return this.streamResponse(response);
  }

  private async streamResponse(response: Response) {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    return new ReadableStream({
      async start(controller) {
        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          controller.enqueue(chunk);
        }
        controller.close();
      }
    });
  }
}
```

### 2. Handling Latency & Reliability

```javascript
// apps/backend/src/middleware/ai-optimizer.ts

class AIOptimizer {
  // Cache frequent queries
  private responseCache = new Map();
  
  // Preload common responses
  private preloadedResponses = {
    greeting: "Hi! I'm Scout, your automotive AI assistant...",
    availability: "Let me check our current inventory...",
    scheduling: "I can help you schedule a test drive..."
  };

  async optimizeRequest(message: string) {
    // 1. Check cache first (instant response)
    const cached = this.responseCache.get(this.hashMessage(message));
    if (cached && this.isCacheFresh(cached)) {
      return { response: cached.response, source: 'cache' };
    }

    // 2. Start on-prem request
    const onPremPromise = this.callOnPrem(message);
    
    // 3. Race condition: on-prem vs timeout
    const result = await Promise.race([
      onPremPromise,
      this.timeout(2000) // 2 second timeout
    ]);

    if (result) {
      this.responseCache.set(this.hashMessage(message), result);
      return { response: result, source: 'on-prem' };
    }

    // 4. Fallback to OpenAI if on-prem is slow
    return { 
      response: await this.callOpenAI(message), 
      source: 'openai-fallback' 
    };
  }
}
```

### 3. Load Balancing Strategy

```javascript
// apps/backend/src/config/ai-routing.config.ts

export const AI_ROUTING = {
  // Route different queries to different models
  routing: {
    // High-value, complex queries → On-prem LLAMA
    'vehicle.recommendation': {
      primary: 'on-prem',
      fallback: 'openai',
      timeout: 5000
    },
    
    // Simple queries → OpenAI (faster)
    'general.greeting': {
      primary: 'openai',
      fallback: 'cached',
      timeout: 1000
    },
    
    // Inventory queries → On-prem (has real-time data)
    'inventory.search': {
      primary: 'on-prem',
      fallback: 'database',
      timeout: 3000
    }
  }
};
```

### 4. Scaling Considerations

```yaml
# docker-compose.yml for on-prem
version: '3.8'
services:
  llama-api:
    image: your-llama-api:latest
    deploy:
      replicas: 3  # Run 3 instances
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]
    ports:
      - "8080-8082:8080"
    environment:
      - MODEL_PATH=/models/llama-70b-scout
      - MAX_CONCURRENT_REQUESTS=10
      - TIMEOUT_SECONDS=30

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - llama-api
```

### 5. Frontend Integration

```typescript
// apps/frontend/hooks/useScoutAgent.ts

export function useScoutAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (text: string) => {
    setIsTyping(true);
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    
    try {
      // Stream response from backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const reader = response.body?.getReader();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = new TextDecoder().decode(value);
        assistantMessage += chunk;
        
        // Update UI in real-time
        setMessages(prev => {
          const updated = [...prev];
          if (updated[updated.length - 1].role === 'assistant') {
            updated[updated.length - 1].content = assistantMessage;
          } else {
            updated.push({ role: 'assistant', content: assistantMessage });
          }
          return updated;
        });
      }
    } catch (error) {
      // Show fallback message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I'm having connection issues. Please try again.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return { messages, sendMessage, isTyping };
}
```

## Performance Optimization

### 1. Response Time Targets
- **Cache hit**: < 10ms
- **On-prem LLAMA**: 500-2000ms
- **OpenAI fallback**: 1000-3000ms
- **Static fallback**: < 50ms

### 2. Availability Strategy
```javascript
// 99.9% uptime with:
if (onPremAvailable) {
  // Primary: On-prem LLAMA
} else if (openAIAvailable) {
  // Secondary: OpenAI GPT-4
} else {
  // Tertiary: Cached/static responses
}
```

### 3. Cost Analysis
- **On-prem LLAMA**: $0 per request (you own hardware)
- **OpenAI fallback**: ~$0.03 per request
- **Monthly estimate**: 95% on-prem = huge savings

## Security Considerations

1. **Tailscale ACLs**: Only EC2 can access on-prem
2. **API Keys**: Rotate monthly
3. **Rate Limiting**: Prevent abuse
4. **Data Privacy**: Sensitive data never leaves on-prem

## Monitoring Dashboard

```javascript
// Track these metrics
{
  "requests_per_minute": 150,
  "on_prem_availability": 99.2,
  "average_response_time": 850,
  "fallback_rate": 0.8,
  "cache_hit_rate": 35.5,
  "active_sessions": 45
}
```

## Summary

Your on-prem LLAMA 70B serves as Scout's brain:
- **Primary agent** for all customer interactions
- **EC2 acts as gateway** and fallback coordinator
- **Tailscale** provides secure, fast connection
- **OpenAI** as backup when on-prem is down
- **Users get** < 2 second responses globally

This architecture gives you:
- ✅ Full control over AI responses
- ✅ No per-request costs (using your hardware)
- ✅ Data privacy (sensitive data stays on-prem)
- ✅ 99.9% availability with fallbacks
- ✅ Global scale through AWS EC2 gateway