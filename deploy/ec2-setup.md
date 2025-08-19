# EC2 Deployment Guide for Scout Backend

## AWS Services Needed
- EC2 (t3.micro - free tier eligible)
- RDS PostgreSQL (optional, can use SQLite initially)
- Elastic IP (free while attached)

## Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2 → Launch Instance
2. Choose:
   - **AMI**: Amazon Linux 2023 or Ubuntu 22.04
   - **Instance Type**: t3.micro (free tier)
   - **Storage**: 20GB (free tier)
   - **Security Group**: Open ports 22 (SSH), 80 (HTTP), 443 (HTTPS), 3001 (API)

## Step 2: Connect and Setup

```bash
# Connect to your instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install nginx (reverse proxy)
sudo yum install -y nginx
```

## Step 3: Deploy Your Backend

```bash
# Clone your repo
git clone https://github.com/your-username/scout-monorepo.git
cd scout-monorepo

# Install dependencies
npm install

# Build backend
npm run build:backend

# Start with PM2
pm2 start dist/apps/backend/main.js --name scout-backend
pm2 save
pm2 startup
```

## Step 4: Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Step 5: Environment Variables

Create `.env` file:
```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=your-database-url
JWT_SECRET=your-secret
```

## Estimated Costs
- **t3.micro EC2**: Free for 1 year, then ~$8/month
- **Elastic IP**: Free while attached
- **Data Transfer**: First 100GB free
- **Total**: $0-10/month initially

## Monitoring
- Use CloudWatch (free tier includes basic monitoring)
- PM2 provides process monitoring
- Set up alerts for CPU > 80%