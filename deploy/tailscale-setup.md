# Tailscale Setup for On-Prem AI Connection

## What is Tailscale?

Tailscale creates a secure, private network between your machines:
- Your EC2 instance gets IP like `100.101.102.103`  
- Your on-prem server gets IP like `100.101.102.104`
- They can talk directly, encrypted, through firewalls
- **No port forwarding, no complex VPN setup**

## How It Works

```
┌─────────────────┐          ┌─────────────────┐
│   AWS EC2       │          │  On-Prem Server │
│  (Public Cloud) │          │  (Behind NAT)   │
│                 │          │                 │
│  Tailscale IP:  │◄────────►│  Tailscale IP:  │
│  100.101.102.5  │  Secure  │  100.101.102.6  │
│                 │  Tunnel  │                 │
│  Can access:    │          │  Running:       │
│  LLAMA API      │          │  LLAMA 70B      │
└─────────────────┘          └─────────────────┘
```

## Step-by-Step Setup (10 minutes)

### 1. Sign Up for Tailscale
- Go to https://tailscale.com
- Sign up with Google/GitHub (free for personal use)
- You get a network like `tail1234.ts.net`

### 2. Install on On-Prem Server (with LLAMA)

```bash
# On your on-prem Ubuntu/Debian server
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate (opens browser)
sudo tailscale up

# Get your Tailscale IP
tailscale ip -4
# Output: 100.101.102.6
```

### 3. Install on EC2 Instance

```bash
# SSH into your EC2
ssh ubuntu@your-ec2-ip

# Install Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# Authenticate
sudo tailscale up

# Get your Tailscale IP  
tailscale ip -4
# Output: 100.101.102.5
```

### 4. Test Connection

```bash
# From EC2, ping your on-prem server
ping 100.101.102.6

# Test LLAMA API
curl http://100.101.102.6:8080/v1/models
```

### 5. Configure Your Backend Code

```javascript
// apps/backend/src/config/ai.config.ts

export const AI_CONFIG = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1'
  },
  onprem: {
    // Use Tailscale IP - works from anywhere!
    endpoint: 'http://100.101.102.6:8080/v1',
    model: 'llama-70b',
    apiKey: process.env.ONPREM_API_KEY
  }
};
```

```javascript
// apps/backend/src/services/ai.service.ts

class AIService {
  async generateResponse(prompt: string, useLocal = false) {
    if (useLocal) {
      // Connect to on-prem LLAMA via Tailscale
      const response = await fetch('http://100.101.102.6:8080/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ONPREM_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-70b',
          prompt: prompt,
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      return response.json();
    } else {
      // Use OpenAI API
      return this.openai.createCompletion({
        model: 'gpt-4',
        prompt: prompt
      });
    }
  }
}
```

## Why Tailscale is Perfect for You

### ✅ Zero Configuration
- No firewall rules
- No port forwarding
- No VPN server setup
- Works behind NAT/CGNAT

### ✅ Secure by Default
- WireGuard encryption (military-grade)
- No public exposure of your LLAMA server
- Access control lists (ACLs)

### ✅ Fast
- Direct peer-to-peer connection
- No central VPN server bottleneck
- ~1ms latency if in same region

### ✅ Reliable
- Automatic reconnection
- Works even if IPs change
- Survives server reboots

## Advanced: Tailscale ACLs

```json
// tailnet policy (optional)
{
  "acls": [
    {
      "action": "accept",
      "src": ["tag:webservers"],
      "dst": ["tag:ai-cluster:8080"]
    }
  ],
  "tagOwners": {
    "tag:webservers": ["you@company.com"],
    "tag:ai-cluster": ["you@company.com"]
  }
}
```

## Alternative: Tailscale Funnel (Public Access)

If you want to expose your API publicly (be careful!):

```bash
# On on-prem server
tailscale funnel 8080
# Gives you: https://your-machine.tail1234.ts.net
```

## Cost

- **Personal use**: FREE (up to 20 devices)
- **Team use**: $5/user/month
- **No bandwidth limits**

## Troubleshooting

```bash
# Check status
tailscale status

# Check routes
tailscale ip -4

# Test connectivity
tailscale ping 100.101.102.6

# View logs
journalctl -u tailscaled
```

## Production Best Practices

1. **Use Tailscale SSH** (optional)
```bash
# Enable Tailscale SSH
tailscale up --ssh

# Now SSH without keys
ssh ubuntu@your-machine
```

2. **Set up DNS**
```bash
# Use magic DNS
http://llama-server:8080  # Instead of IP
```

3. **Monitor Connection**
```javascript
// Health check in your backend
async function checkOnPremConnection() {
  try {
    const response = await fetch('http://100.101.102.6:8080/health');
    return response.ok;
  } catch (error) {
    console.error('On-prem LLAMA unreachable');
    return false;
  }
}
```

## Complete Example Flow

1. **User asks question** → Scout Frontend (Vercel)
2. **API request** → EC2 Backend
3. **Backend decides**:
   - Simple query → OpenAI API
   - Private/complex → On-prem LLAMA via Tailscale
4. **Response** → Back to user

## Summary

With Tailscale, your EC2 and on-prem LLAMA talk like they're on the same local network, even though one's in AWS and one's in your office. Setup takes 10 minutes, and it just works!