# Scout Team Architecture

## Infrastructure Setup

### 1. Development Environment (Team of 4)

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                    (main, dev, feature branches)             │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
        ▼                                           ▼
┌──────────────────┐                    ┌──────────────────┐
│   Vercel          │                    │   AWS EC2        │
│   (Frontend)      │                    │   (Backend API)  │
│                   │                    │                  │
│ • Production      │                    │ • t3.large       │
│ • Preview deploys │◄───────────────────│ • Fastify API    │
│ • Auto from GitHub│                    │ • PM2 process    │
└──────────────────┘                    └──────────────────┘
                                                │
                                                │ VPN/Tunnel
                                                ▼
                                    ┌──────────────────┐
                                    │  On-Prem Cluster │
                                    │                  │
                                    │ • LLAMA 70B      │
                                    │ • GPU compute    │
                                    │ • Private subnet │
                                    └──────────────────┘
```

### 2. EC2 Instance Specs

**Recommended: t3.large**
- 2 vCPU, 8GB RAM
- ~$60/month (or use Reserved Instance for ~$35/month)
- Handles API requests, coordinates with AI services
- Can support 100+ concurrent users easily

**Scaling Path:**
- t3.large → t3.xlarge → t3.2xlarge
- Or move to c6i.large for compute-intensive tasks
- Add load balancer + multiple instances later

### 3. AI Integration Strategy

**Two-Tier AI Approach:**

```javascript
// apps/backend/src/services/ai.service.ts

class AIService {
  async getCompletion(prompt, options = {}) {
    const { useLocal = false, model = 'gpt-4' } = options;
    
    if (useLocal && this.isOnPremAvailable()) {
      // Route to your on-prem LLAMA 70B
      return this.callOnPremLLAMA(prompt);
    } else {
      // Use OpenAI API
      return this.callOpenAI(prompt, model);
    }
  }
  
  async callOnPremLLAMA(prompt) {
    // VPN tunnel or dedicated connection
    const response = await fetch('http://10.0.0.100:8080/v1/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.ONPREM_API_KEY}` },
      body: JSON.stringify({ prompt, model: 'llama-70b' })
    });
    return response.json();
  }
}
```

### 4. Environment Configuration

**Development Workflow:**

```bash
# .env.development (local dev)
NEXT_PUBLIC_API_URL=http://localhost:3001
OPENAI_API_KEY=sk-...
ONPREM_AI_URL=http://vpn.company.com:8080

# .env.staging (EC2 staging)
NEXT_PUBLIC_API_URL=https://api-staging.scout.com
OPENAI_API_KEY=sk-...
ONPREM_AI_URL=http://10.0.0.100:8080

# .env.production (EC2 production)
NEXT_PUBLIC_API_URL=https://api.scout.com
OPENAI_API_KEY=sk-...
ONPREM_AI_URL=http://10.0.0.100:8080
```

### 5. Team Development Workflow

**Git Branching Strategy:**
```
main          → Production (auto-deploy to Vercel + EC2)
└── staging   → Staging environment
    └── dev   → Development (feature integration)
        └── feature/user-auth    (developer 1)
        └── feature/ai-chat      (developer 2)
        └── feature/inventory    (developer 3)
        └── feature/scheduling   (developer 4)
```

**Vercel Configuration:**
- Main branch → Production deployment
- All PRs → Preview deployments
- Staging branch → Staging deployment

### 6. Connecting On-Prem AI Cluster

**Option A: VPN Tunnel (Secure)**
```bash
# On EC2
sudo yum install -y openvpn
# Configure VPN to your on-prem network
```

**Option B: Cloudflare Tunnel (Easier)**
```bash
# On your on-prem server
cloudflared tunnel create scout-ai
cloudflared tunnel route dns scout-ai ai.internal.company.com
cloudflared tunnel run scout-ai
```

**Option C: Tailscale (Simplest)**
```bash
# Both EC2 and on-prem
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up
# Now both machines can talk privately
```

### 7. Cost Optimization

**Monthly Costs (Estimated):**
- EC2 t3.large: $60
- RDS PostgreSQL (db.t3.micro): $15
- S3 + CloudFront: $5
- Vercel Pro (team): $20/user
- **Total: ~$100-180/month**

**Free Resources:**
- On-prem LLAMA 70B (no GPU costs!)
- GitHub (free for public repos)
- Vercel free tier (if staying under limits)

### 8. Quick Start for Your AWS Team Member

```bash
# 1. Launch EC2
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name team-key \
  --security-group-ids sg-scout \
  --subnet-id subnet-xxxxxx

# 2. Install dependencies
ssh ubuntu@instance-ip
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx certbot

# 3. Setup GitHub Actions for auto-deploy
# (config provided in .github/workflows/)
```

### 9. Database Recommendation

Start with **PostgreSQL on RDS**:
- db.t3.micro (free tier eligible first year)
- Auto-backups
- Easy scaling
- Your team member familiar with AWS can set up in 10 minutes

### 10. Monitoring & Logging

```javascript
// Use DataDog free tier or AWS CloudWatch
import { StatsD } from 'node-statsd';

const metrics = new StatsD({
  host: 'localhost',
  port: 8125
});

// Track API performance
metrics.timing('api.response_time', responseTime);
metrics.increment('api.requests');
metrics.gauge('ai.on_prem.availability', isAvailable ? 1 : 0);
```

## Next Steps for Team

1. **Person 1**: Set up GitHub repo, invite team
2. **Person 2**: Configure Vercel, connect to GitHub  
3. **Person 3**: Launch EC2, install dependencies
4. **Person 4**: Set up VPN/tunnel to on-prem cluster

This setup gives you:
- ✅ Scalable architecture
- ✅ Team collaboration with preview deploys
- ✅ Cost-effective (~$100/month)
- ✅ Leverages your on-prem AI (saving $1000s on GPU costs)
- ✅ Can handle thousands of users on single EC2