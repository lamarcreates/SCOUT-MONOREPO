# Testing the Chat Interface

## Setup

1. **Add OpenAI API Key**
   - Edit `/apps/frontend/.env.local`
   - Replace `your-openai-api-key-here` with your actual OpenAI API key
   - Save the file

2. **Restart the development server** (if needed)
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000

## Testing the Chat

### Basic Chat Testing
1. Navigate to http://localhost:4200
2. Click "Start Chat with AI" button
3. You should see the chat interface with a welcome message
4. Try sending messages like:
   - "I'm looking for a family SUV under $40,000"
   - "What electric vehicles do you have?"
   - "Can you help me schedule a test drive?"

### Quick Action Buttons
1. On the chat page, you'll see three quick action buttons below the chat
2. Click any of them to auto-populate and send a prompt:
   - "Find My Perfect Car"
   - "Schedule Test Drive"
   - "Compare Vehicles"

### Expected Behavior
- Messages should stream in real-time from the AI
- The chat should maintain conversation context
- Loading indicators should appear while waiting for responses
- The interface should auto-scroll to new messages

## Troubleshooting

### If chat doesn't work:
1. **Check API Key**: Ensure OPENAI_API_KEY is set in `.env.local`
2. **Check Console**: Open browser dev tools (F12) and check for errors
3. **Verify Backend**: Ensure backend is running on port 3000
4. **Network Tab**: Check if requests to `/api/chat` are successful

### Common Issues:
- **401 Unauthorized**: Invalid or missing OpenAI API key
- **429 Rate Limit**: OpenAI rate limiting - wait a moment and try again
- **Network Error**: Backend server not running

## Next Steps

Once basic chat is working with OpenAI, we can:
1. Connect to on-premise LLAMA 70B via Tailscale
2. Add routing logic to choose between OpenAI and LLAMA
3. Implement fallback from LLAMA to OpenAI
4. Add conversation persistence/history
5. Implement user authentication

## Environment Variables

Current `.env.local` structure:
```env
# OpenAI API Key (temporary - will switch to on-prem LLAMA)
OPENAI_API_KEY=your-openai-api-key-here

# Future: On-premise LLAMA endpoint via Tailscale
# LLAMA_ENDPOINT=http://100.x.x.x:8080/v1/chat/completions
# LLAMA_API_KEY=your-llama-key-here

# Other environment variables
NEXT_PUBLIC_APP_URL=http://localhost:3000
```