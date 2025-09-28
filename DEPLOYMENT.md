# 🚀 Deployment Guide - Weather App Pro

This guide covers various deployment options for your Weather App Pro application.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ API keys for OpenWeatherMap and MapBox
- ✅ Node.js 14+ installed
- ✅ Git repository set up
- ✅ Domain name (optional)

## 🌐 Deployment Options

### 1. Heroku Deployment

#### Quick Deploy
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### Manual Setup
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-weather-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set OPENWEATHER_API_KEY=your_openweather_key
   heroku config:set MAPBOX_API_KEY=your_mapbox_key
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

### 2. Vercel Deployment

#### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `OPENWEATHER_API_KEY`
   - `MAPBOX_API_KEY`
   - `NODE_ENV=production`
3. Deploy automatically on every push

#### Manual Deployment
```bash
npm install -g vercel
vercel --prod
```

### 3. Netlify Deployment

1. **Build Configuration** (`netlify.toml`)
   ```toml
   [build]
     command = "npm install && npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "16"
   ```

2. **Deploy via Git**
   - Connect repository to Netlify
   - Set environment variables
   - Auto-deploy on push

### 4. DigitalOcean App Platform

1. **Create App Specification** (`app.yaml`)
   ```yaml
   name: weather-app-pro
   services:
   - name: web
     source_dir: /
     github:
       repo: yourusername/weather-app-pro
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: OPENWEATHER_API_KEY
       value: your_key_here
     - key: MAPBOX_API_KEY
       value: your_key_here
     - key: NODE_ENV
       value: production
   ```

2. **Deploy**
   ```bash
   doctl apps create --spec app.yaml
   ```

### 5. AWS Deployment

#### Using AWS Elastic Beanstalk
1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   eb init
   eb create production
   ```

3. **Set Environment Variables**
   ```bash
   eb setenv OPENWEATHER_API_KEY=your_key
   eb setenv MAPBOX_API_KEY=your_key
   eb setenv NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### 6. Docker Deployment

#### Create Dockerfile
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

#### Build and Run
```bash
docker build -t weather-app-pro .
docker run -p 3000:3000 \
  -e OPENWEATHER_API_KEY=your_key \
  -e MAPBOX_API_KEY=your_key \
  -e NODE_ENV=production \
  weather-app-pro
```

## 🔧 Environment Configuration

### Required Environment Variables
```bash
# Weather APIs
OPENWEATHER_API_KEY=your_openweathermap_api_key
MAPBOX_API_KEY=your_mapbox_api_key

# Application
NODE_ENV=production
PORT=3000

# Optional
CACHE_TTL=300
```

### Getting API Keys

#### OpenWeatherMap API
1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Sign up for free account
3. Generate API key
4. Free tier: 1,000 calls/day

#### MapBox API
1. Visit [MapBox](https://www.mapbox.com/)
2. Create free account
3. Generate access token
4. Free tier: 100,000 requests/month

## 🛠️ Production Optimizations

### 1. Performance
- ✅ Enable gzip compression
- ✅ Use CDN for static assets
- ✅ Implement caching headers
- ✅ Optimize images

### 2. Security
- ✅ Use HTTPS
- ✅ Set security headers
- ✅ Rate limiting
- ✅ Input validation

### 3. Monitoring
- ✅ Health check endpoints
- ✅ Error logging
- ✅ Performance monitoring
- ✅ Uptime monitoring

## 📊 Health Checks

Your app includes a health check endpoint:
```http
GET /api/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.0.0",
  "services": {
    "weather": "operational",
    "geocoding": "operational"
  }
}
```

## 🔍 Troubleshooting

### Common Issues

#### 1. API Key Errors
```
Error: Weather service error: Invalid API key
```
**Solution:** Verify API keys are correctly set in environment variables

#### 2. CORS Issues
```
Error: CORS policy blocked
```
**Solution:** Ensure CORS is properly configured for your domain

#### 3. Port Issues
```
Error: Port 3000 already in use
```
**Solution:** Set PORT environment variable or use different port

#### 4. Memory Issues
```
Error: JavaScript heap out of memory
```
**Solution:** Increase Node.js memory limit:
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

## 📈 Scaling Considerations

### For High Traffic
1. **Load Balancing**
   - Use multiple instances
   - Implement sticky sessions
   - Health check configuration

2. **Caching**
   - Redis for session storage
   - CDN for static assets
   - API response caching

3. **Database**
   - Consider database for user preferences
   - Cache frequently accessed data

4. **Monitoring**
   - Application performance monitoring
   - Error tracking (Sentry)
   - Uptime monitoring

## 🎯 Performance Benchmarks

### Target Metrics
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **Time to Interactive:** < 3.5s
- **Cumulative Layout Shift:** < 0.1

### Optimization Checklist
- [ ] Enable compression
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Use CDN
- [ ] Implement caching
- [ ] Monitor performance

## 📞 Support

If you encounter deployment issues:
1. Check the logs: `heroku logs --tail`
2. Verify environment variables
3. Test locally with production settings
4. Check API key limits and quotas

---

**Happy Deploying! 🚀**
