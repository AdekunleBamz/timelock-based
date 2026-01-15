# Deployment Guide

## Overview

This guide covers deploying the Timelock Vault application to various environments.

## Prerequisites

- Node.js 20+
- Docker (optional)
- Access to hosting provider
- Environment variables configured

## Environment Variables

Create a `.env.production` file:

```bash
VITE_API_URL=https://api.yourdomain.com
VITE_CHAIN_ID=8453
VITE_VAULT_ADDRESS=0x...
VITE_ROUTER_ADDRESS=0x...
VITE_USDC_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
VITE_ENABLE_ANALYTICS=true
```

## Build Process

### Local Build

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Docker Build

```bash
docker build -t timelock-vault:latest ./vault-ui
```

## Deployment Options

### 1. Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd vault-ui
vercel --prod
```

### 2. Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd vault-ui
netlify deploy --prod --dir=dist
```

### 3. AWS S3 + CloudFront

```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### 4. Docker Deployment

```bash
# Build image
docker build -t timelock-vault:latest ./vault-ui

# Run container
docker run -d -p 80:80 --name vault-ui timelock-vault:latest

# Or use Docker Compose
docker-compose up -d
```

### 5. Traditional VPS (Nginx)

```bash
# Build locally
npm run build

# Upload dist/ to server
scp -r dist/* user@server:/var/www/vault

# Configure Nginx (use nginx.conf from repo)
sudo ln -s /etc/nginx/sites-available/vault /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## CI/CD Pipeline

### GitHub Actions (Already Configured)

The `.github/workflows/ci.yml` file handles:
- Linting
- Type checking
- Testing
- Building

To add deployment:

```yaml
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: |
    npm run build
    # Add your deployment commands
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
stages:
  - test
  - build
  - deploy

test:
  stage: test
  script:
    - npm ci
    - npm run lint
    - npm run type-check
    - npm test

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  only:
    - main
  script:
    - # Add deployment commands
```

## Post-Deployment

### 1. Verify Deployment

- Check website loads correctly
- Test wallet connection
- Verify contract interactions
- Check analytics tracking

### 2. Monitor

- Set up error tracking (Sentry, etc.)
- Monitor performance (Lighthouse, etc.)
- Track user analytics
- Monitor blockchain interactions

### 3. Rollback Plan

```bash
# Vercel
vercel rollback

# Docker
docker-compose down
docker-compose up -d --build

# Git-based
git revert HEAD
git push origin main
```

## Performance Optimization

### 1. Enable CDN

- Use CloudFront, Cloudflare, or similar
- Cache static assets
- Compress responses

### 2. Optimize Images

```bash
# Use sharp or similar
npm install sharp
```

### 3. Code Splitting

Already configured with Vite's automatic code splitting.

### 4. Service Worker (Optional)

Add PWA support for offline functionality.

## Security Checklist

- [ ] Environment variables not exposed
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSP policy set
- [ ] Rate limiting on API
- [ ] CORS properly configured
- [ ] Contract addresses verified
- [ ] Audit smart contracts

## Monitoring & Logging

### Application Logs

Use logging service like:
- Datadog
- Logz.io
- CloudWatch

### Uptime Monitoring

- UptimeRobot
- Pingdom
- StatusCake

### Performance

- Google Lighthouse
- WebPageTest
- GTmetrix

## Scaling

### Horizontal Scaling

```bash
# Docker Swarm
docker swarm init
docker service create --replicas 3 -p 80:80 timelock-vault:latest

# Kubernetes
kubectl apply -f k8s/deployment.yaml
kubectl scale deployment vault-ui --replicas=3
```

### Load Balancer

Configure load balancer (ALB, nginx, etc.) for multiple instances.

## Troubleshooting

### Build Fails

```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

### Docker Issues

```bash
# Check logs
docker logs vault-ui

# Rebuild without cache
docker build --no-cache -t timelock-vault:latest ./vault-ui
```

### Deployment Errors

1. Check environment variables
2. Verify network connectivity
3. Review error logs
4. Check disk space
5. Verify permissions

## Support

For deployment issues:
- Check documentation
- Review GitHub issues
- Contact support team
