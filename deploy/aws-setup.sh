#!/bin/bash

# Scout Backend EC2 Setup Script
# Run this after launching your EC2 instance (Ubuntu 22.04 recommended)

echo "🚀 Setting up Scout Backend on EC2..."

# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install essential tools
sudo apt-get install -y git nginx certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2

# Create app directory
sudo mkdir -p /var/www/scout-backend
sudo chown -R ubuntu:ubuntu /var/www/scout-backend

# Clone repository
cd /var/www
git clone https://github.com/YOUR_TEAM/scout-monorepo.git scout-backend
cd scout-backend

# Install dependencies
npm install

# Build the backend
npm run build:backend

# Setup environment variables
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@rds-endpoint:5432/scout
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-key
ONPREM_AI_URL=http://your-on-prem-cluster:8080
CORS_ORIGIN=https://your-frontend.vercel.app
EOF

# Start with PM2
pm2 start dist/apps/backend/main.js --name scout-api
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Configure Nginx
sudo tee /etc/nginx/sites-available/scout-api << 'EOF'
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/scout-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update the .env file with your actual credentials"
echo "2. Set up SSL with: sudo certbot --nginx -d api.yourdomain.com"
echo "3. Configure your domain DNS to point to this server"
echo "4. Set up GitHub Actions for automatic deployment"
echo ""
echo "Your API should be accessible at http://$(curl -s ifconfig.me):80"