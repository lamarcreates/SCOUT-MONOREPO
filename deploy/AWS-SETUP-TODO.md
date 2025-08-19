# AWS Setup TODO List

## Phase 1: Basic Infrastructure (Week 1)

### 1. AWS Account Setup
- [ ] Create AWS account (if not exists)
- [ ] Set up billing alerts at $50, $100, $200
- [ ] Create IAM user for deployment (not root)
- [ ] Generate access keys for CLI

### 2. EC2 Instance Setup
- [ ] Launch t3.large instance (Ubuntu 22.04 LTS)
- [ ] Configure security group:
  - Port 22 (SSH) - Your IP only
  - Port 80 (HTTP) - 0.0.0.0/0
  - Port 443 (HTTPS) - 0.0.0.0/0
  - Port 3001 (API) - 0.0.0.0/0
- [ ] Allocate and attach Elastic IP
- [ ] SSH into instance and run setup script:
  ```bash
  wget https://raw.githubusercontent.com/YOUR_REPO/main/deploy/aws-setup.sh
  chmod +x aws-setup.sh
  ./aws-setup.sh
  ```

### 3. RDS PostgreSQL Setup
- [ ] Create RDS instance (db.t3.micro)
- [ ] Configure:
  - Engine: PostgreSQL 15
  - Storage: 20GB SSD
  - Backup: 7 days retention
  - Multi-AZ: No (for now)
- [ ] Set master password securely
- [ ] Configure security group to allow EC2 access
- [ ] Note endpoint URL for .env file

### 4. S3 Bucket Setup
- [ ] Create bucket: `scout-assets-prod`
- [ ] Configure CORS for frontend access
- [ ] Create IAM policy for EC2 access
- [ ] Set up lifecycle rules (optional):
  - Move to IA after 30 days
  - Delete temp files after 7 days

### 5. Environment Configuration
- [ ] Create `.env.production` on EC2:
  ```env
  NODE_ENV=production
  PORT=3001
  DATABASE_URL=postgresql://admin:password@rds-endpoint:5432/scout
  JWT_SECRET=generate-secure-secret-here
  AWS_BUCKET=scout-assets-prod
  AWS_REGION=us-east-1
  FRONTEND_URL=https://scout.vercel.app
  ```

## Phase 2: Networking & Security (Week 2)

### 6. Domain & SSL Setup
- [ ] Purchase domain (if needed)
- [ ] Point domain to EC2 Elastic IP
- [ ] Install SSL certificate:
  ```bash
  sudo certbot --nginx -d api.yourdomain.com
  ```
- [ ] Set up auto-renewal

### 7. Tailscale Setup (for On-Prem Connection)
- [ ] Create Tailscale account
- [ ] Install on EC2:
  ```bash
  curl -fsSL https://tailscale.com/install.sh | sh
  sudo tailscale up
  ```
- [ ] Install on on-prem server
- [ ] Verify connection:
  ```bash
  tailscale ping on-prem-server
  ```
- [ ] Update .env with Tailscale IP:
  ```env
  ONPREM_LLAMA_URL=http://100.x.x.x:8080
  ```

### 8. Monitoring Setup
- [ ] Enable CloudWatch detailed monitoring
- [ ] Set up alarms:
  - CPU > 80%
  - Memory > 90%
  - Disk > 80%
  - API errors > 1%
- [ ] Configure CloudWatch Logs
- [ ] Set up log retention (30 days)

## Phase 3: CI/CD & Automation (Week 3)

### 9. GitHub Actions Setup
- [ ] Add secrets to GitHub repo:
  - `EC2_HOST`: Your EC2 IP
  - `EC2_SSH_KEY`: Private key for EC2
  - `EC2_USERNAME`: ubuntu
- [ ] Test deployment pipeline
- [ ] Set up branch protection rules

### 10. Backup Strategy
- [ ] Enable RDS automated backups
- [ ] Create S3 backup bucket
- [ ] Set up database dump script:
  ```bash
  pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz
  aws s3 cp backup-*.sql.gz s3://scout-backups/
  ```
- [ ] Schedule with cron (daily at 2 AM)

## Phase 4: Optimization (Month 2)

### 11. Performance Tuning
- [ ] Install Redis (or use ElastiCache)
- [ ] Configure nginx caching
- [ ] Optimize database indexes
- [ ] Set up CDN for static assets

### 12. Scaling Preparation
- [ ] Document current architecture
- [ ] Create AMI snapshot of EC2
- [ ] Plan load balancer setup
- [ ] Prepare horizontal scaling strategy

## Cost Monitoring Checklist

### Weekly Tasks
- [ ] Check AWS Cost Explorer
- [ ] Review CloudWatch metrics
- [ ] Check for unused resources
- [ ] Optimize if > $100/month

### Monthly Tasks
- [ ] Review RDS performance insights
- [ ] Analyze S3 storage classes
- [ ] Check data transfer costs
- [ ] Consider reserved instances

## Emergency Procedures

### If Site Goes Down
1. Check EC2 instance status
2. SSH and check logs: `pm2 logs`
3. Restart services: `pm2 restart all`
4. Check RDS connectivity
5. Verify Tailscale connection

### If Costs Spike
1. Check CloudWatch for traffic spike
2. Review S3 data transfer
3. Check for runaway Lambda/processes
4. Enable rate limiting if needed

## Team Responsibilities

### DevOps Team Member
- Owns: EC2, RDS, S3, networking
- Weekly: Monitor costs and performance
- On-call: Primary for infrastructure

### Backend Developer
- Owns: API deployment, database schema
- Weekly: Deploy updates, check logs
- On-call: Primary for API issues

### AI/ML Team Member
- Owns: Tailscale, on-prem connection
- Weekly: Monitor LLAMA availability
- On-call: Primary for AI services

## Notes for Later

### When You Have Revenue
- [ ] Upgrade to t3.xlarge
- [ ] Enable RDS Multi-AZ
- [ ] Add CloudFront CDN
- [ ] Consider AWS Shield (DDoS protection)
- [ ] Add DataDog or New Relic

### When You Hit 1000 Users
- [ ] Add Application Load Balancer
- [ ] Set up auto-scaling group
- [ ] Implement ElastiCache Redis
- [ ] Consider Aurora instead of RDS

### When You Need Compliance
- [ ] Switch Tailscale → AWS VPN
- [ ] Enable AWS GuardDuty
- [ ] Implement AWS WAF
- [ ] Set up AWS CloudTrail

## Quick Commands Reference

```bash
# SSH to EC2
ssh -i scout-key.pem ubuntu@your-ec2-ip

# Check API status
pm2 status

# View logs
pm2 logs scout-api

# Restart API
pm2 restart scout-api

# Check disk space
df -h

# Check memory
free -m

# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Test on-prem connection
curl http://100.x.x.x:8080/health
```

---

Save this document and give it to your AWS team member. They can work through it while you focus on Vercel deployment!