# AWS Services Setup for Scout

## Minimum Viable Setup (Start Here)

### 1. EC2 Instance (Application Server)
```bash
# t3.large: 2 vCPU, 8GB RAM
# Runs: Fastify API, handles all business logic
# Cost: ~$60/month
```

### 2. RDS PostgreSQL (Database)
```sql
-- Database Schema
CREATE DATABASE scout_production;

-- Core tables needed:
- users (authentication, profiles)
- vehicles (inventory)
- appointments (scheduling)
- chat_sessions (AI conversations)
- leads (customer tracking)
```

**Setup:**
```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier scout-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username admin \
  --master-user-password YOUR_PASSWORD \
  --allocated-storage 20 \
  --backup-retention-period 7
```

**Cost:** ~$15/month (db.t3.micro)

### 3. S3 Bucket (File Storage)
```bash
# Create S3 bucket for files
aws s3 mb s3://scout-assets-prod

# Bucket structure:
scout-assets-prod/
├── vehicle-images/
├── user-documents/
├── reports/
└── backups/
```

**Cost:** ~$5/month for 100GB

## Total Initial AWS Costs
- EC2 t3.large: $60
- RDS db.t3.micro: $15  
- S3 Storage: $5
- **Total: ~$80/month**

## Optional Services (Phase 2)

### ElastiCache Redis (After 1000+ users)
```javascript
// Use for:
- Session storage
- API response caching
- Real-time features
- Rate limiting

// Cost: $15/month (cache.t3.micro)
```

### SES (Email Service)
```javascript
// For sending emails
- Appointment confirmations
- Password resets
- Marketing emails
// Cost: $0.10 per 1000 emails
```

## Services You DON'T Need Initially

### ❌ Multiple EC2 Instances
- One t3.large handles 5000+ users easily
- Add load balancer when you hit 10,000+ users

### ❌ Lambda Functions
- Your EC2 runs everything
- Consider Lambda only for specific tasks later

### ❌ DynamoDB
- PostgreSQL handles all your data needs
- 100x easier than managing two databases

### ❌ CloudFront CDN
- Vercel already provides CDN for frontend
- S3 direct access is fine for images initially

## Quick Start Commands

```bash
# 1. Launch EC2
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name scout-key \
  --security-groups scout-sg

# 2. Create RDS
aws rds create-db-instance \
  --db-instance-identifier scout-db \
  --db-instance-class db.t3.micro \
  --engine postgres

# 3. Create S3 Bucket
aws s3 mb s3://scout-assets-prod

# That's it! Just 3 services to start
```

## Environment Variables for Backend

```env
# .env.production
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://admin:password@scout-db.xyz.rds.amazonaws.com:5432/scout

# S3
AWS_BUCKET=scout-assets-prod
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...

# AI Services
OPENAI_API_KEY=sk-...
ONPREM_LLAMA_URL=http://10.0.0.100:8080

# Frontend URL
FRONTEND_URL=https://scout.vercel.app
```

## Architecture Decision

```
Internet → Vercel (Frontend) 
           ↓
         EC2 (API)
           ↓
    RDS PostgreSQL + S3

This is 10x simpler than microservices!
```