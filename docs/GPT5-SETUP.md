# GPT-5 Integration Setup

## Overview
This branch (`feature/gpt5-reasoning-engine`) implements GPT-5, OpenAI's most advanced reasoning model, for the MotorScout scheduling system.

## Why GPT-5?
GPT-5 offers significant advantages over GPT-3.5-turbo and GPT-4:
- **Superior reasoning capabilities** - Breaks down complex scheduling workflows step-by-step
- **Better tool orchestration** - Automatically chains tools (search → check → book)
- **Transparent execution** - Explains reasoning before tool calls
- **Custom tools support** - Better handling of domain-specific tools
- **Configurable reasoning effort** - Balance between speed and intelligence

## Setup Instructions

### 1. Get AI Gateway API Key
1. Go to [Vercel AI Gateway Dashboard](https://vercel.com/dashboard/stores/ai-gateway)
2. Create or access your AI Gateway store
3. Copy your API key

### 2. Configure Environment
Add to `/apps/frontend/.env.local`:
```env
AI_GATEWAY_API_KEY=your-ai-gateway-key-here
```

### 3. Model Configuration
The chat routes are configured to use GPT-5 with:
- **Model**: `"openai/gpt-5"` (via AI Gateway)
- **Reasoning effort**: `"medium"` (balanced performance)
- **Verbosity**: `"low"` (concise responses)
- **Max steps**: `5` (for complex tool chains)

## GPT-5 Models Available
- `openai/gpt-5` - Full reasoning model with broad knowledge
- `openai/gpt-5-mini` - Cost-optimized, faster responses
- `openai/gpt-5-nano` - Highest throughput for simple tasks

## Testing the Integration

### Test basic scheduling:
```bash
curl -X POST http://localhost:4200/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"I want to schedule a test drive for a Toyota RAV4"}]}'
```

### Expected behavior with GPT-5:
1. AI explains what it's doing ("Let me search our inventory...")
2. Calls `searchInventory` tool
3. Presents results with vehicle IDs
4. Guides through selection process
5. Checks availability
6. Collects customer information
7. Confirms booking with confirmation number

## Fallback Options
If AI Gateway authentication is not available:
1. Use `openai('gpt-4o')` - Direct OpenAI API, better than GPT-3.5
2. Use `openai('gpt-4-turbo')` - Previous generation, still good
3. Keep `openai('gpt-3.5-turbo')` - Cheapest but limited tool handling

## Cost Considerations
GPT-5 pricing through AI Gateway (estimated):
- More expensive than GPT-4o (~2-3x)
- Significantly more expensive than GPT-3.5 (~10x)
- Worth it for production scheduling systems where accuracy is critical

## Monitoring
AI Gateway provides:
- Usage tracking and analytics
- Cost monitoring
- Request logs
- Performance metrics

Access at: https://vercel.com/dashboard/stores/ai-gateway