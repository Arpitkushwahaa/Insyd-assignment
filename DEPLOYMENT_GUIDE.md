# Deployment Guide

Quick deployment options for production.

## Railway (Recommended)

Fast deployment with built-in PostgreSQL/MongoDB support.

### Backend
1. Push code to GitHub
2. Go to railway.app
3. New Project → Deploy from GitHub
4. Select your repo → Choose backend folder
5. Add environment variables:
   ```
   MONGODB_URI=<your-mongo-uri>
   JWT_SECRET=<random-secret>
   PORT=5000
   NODE_ENV=production
   ```
6. Deploy

### Frontend
1. New service in same project
2. Select frontend folder
3. Add env variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
   ```
4. Deploy

## Vercel + MongoDB Atlas

### Backend (Vercel Serverless)
```bash
cd backend
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### Frontend
```bash
cd frontend
vercel
```

## Docker

```bash
# build and run
docker-compose up --build

# production mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster.net/db
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.com
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## Post-Deployment

1. Seed data: `npm run seed`
2. Test login with demo credentials
3. Check logs for errors
4. Setup monitoring (optional)


### Step 2: Deploy Backend to Render

1. **Create Render Account**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:

     ```
     Name: insyd-inventory-backend
     Region: Singapore (closest to India)
     Branch: main
     Root Directory: backend
     Runtime: Node
     Build Command: npm install && npm run build
     Start Command: npm start
     ```

3. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/insyd_inventory
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   PORT=5000
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://insyd-inventory-backend.onrender.com`

5. **Run Seed Script** (One-time)
   - In Render dashboard → Shell
   ```bash
   npm run seed
   ```

### Step 3: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:

     ```
     Framework Preset: Next.js
     Root Directory: frontend
     Build Command: npm run build
     Output Directory: .next
     Install Command: npm install
     ```

3. **Add Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://insyd-inventory-backend.onrender.com/api
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment (3-5 minutes)
   - Your app will be live at: `https://your-project.vercel.app`

5. **Update CORS in Backend**
   - Go back to Render → Environment Variables
   - Update `CORS_ORIGIN` with your Vercel URL

### Step 4: Test Deployment

1. Visit your Vercel URL
2. Login with demo credentials:
   - Admin: `admin@insyd.com` / `password123`
   - Staff: `staff@insyd.com` / `password123`
3. Test all features:
   - Dashboard loads
   - SKU list appears
   - Stock movement works
   - Insights display correctly

---

## 🐳 Option 2: Docker Deployment

### Create Docker Files

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml** (root directory):
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: insyd_mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: securepassword
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: insyd_backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://admin:securepassword@mongodb:27017/insyd_inventory?authSource=admin
      - JWT_SECRET=your-super-secret-jwt-key-min-32-characters
      - NODE_ENV=production
      - CORS_ORIGIN=http://localhost:3000
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    container_name: insyd_frontend
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### Deploy with Docker

```powershell
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f

# Run seed script
docker-compose exec backend npm run seed

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 🔧 Post-Deployment Configuration

### 1. Custom Domain (Optional)

**Vercel:**
- Go to Project Settings → Domains
- Add your custom domain
- Update DNS records as instructed

**Render:**
- Go to Settings → Custom Domains
- Add domain and configure DNS

### 2. SSL Certificate

Both Vercel and Render provide automatic SSL certificates.

### 3. Environment-Specific Configurations

**Production Best Practices:**
```env
# Backend
NODE_ENV=production
JWT_SECRET=use-strong-random-string-min-32-chars
MONGODB_URI=use-atlas-connection-string
CORS_ORIGIN=https://yourdomain.com

# Frontend
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### 4. Monitoring Setup

**Backend Monitoring:**
- Enable Render logs and metrics
- Consider adding Sentry for error tracking
- Setup uptime monitoring (UptimeRobot, Better Uptime)

**Frontend Monitoring:**
- Vercel Analytics (built-in)
- Google Analytics (optional)

---

## 🔒 Security Hardening

### Backend Security

1. **Rate Limiting**
   ```typescript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

2. **Helmet Headers** (Already implemented)

3. **MongoDB Indexing**
   ```typescript
   // Add in model files
   SKUSchema.index({ skuCode: 1 }, { unique: true });
   StockMovementSchema.index({ sku: 1, createdAt: -1 });
   ```

4. **Input Validation** (Already implemented with express-validator)

### Frontend Security

1. **Environment Variables**
   - Never commit `.env.local`
   - Use different API URLs for dev/prod

2. **XSS Protection**
   - Next.js provides automatic XSS protection
   - Always sanitize user inputs

---

## 📊 Performance Optimization

### Backend

1. **Database Indexing**
   ```typescript
   // Already implemented in models
   ```

2. **Compression** (Already enabled)

3. **Caching** (Future enhancement)
   ```typescript
   import Redis from 'ioredis';
   const redis = new Redis(process.env.REDIS_URL);
   ```

### Frontend

1. **Image Optimization**
   - Use Next.js Image component
   - Lazy load images

2. **Code Splitting**
   - Next.js does this automatically

3. **Static Generation** (where possible)
   ```typescript
   export const revalidate = 60; // ISR - revalidate every 60 seconds
   ```

---

## 🔄 CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          # Vercel auto-deploys on push
          echo "Vercel will auto-deploy"
```

---

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
```powershell
# Check logs
heroku logs --tail  # if using Heroku
# or Render logs in dashboard

# Verify environment variables
# Check MongoDB connection string
```

**Frontend can't connect to backend:**
```powershell
# Verify NEXT_PUBLIC_API_URL is correct
# Check CORS settings in backend
# Test API endpoint directly: curl https://your-backend/health
```

**Database connection failed:**
```powershell
# Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
# Check username/password in connection string
# Ensure database user has readWrite permissions
```

---

## 📈 Scaling Considerations

### Horizontal Scaling

**Backend:**
- Render: Upgrade to paid plan, enable auto-scaling
- Add load balancer
- Use Redis for session management

**Database:**
- MongoDB Atlas: Upgrade cluster tier
- Enable sharding for large datasets
- Add read replicas

**Frontend:**
- Vercel handles scaling automatically
- Consider CDN for static assets

---

## 💰 Cost Estimation

### Free Tier (POC/Demo)
- MongoDB Atlas: Free M0 (512MB)
- Render: Free (with cold starts)
- Vercel: Free (personal projects)
- **Total: ₹0/month**

### Production (Small Business)
- MongoDB Atlas: M10 (~$57/month = ₹4,700)
- Render: Starter ($7/month = ₹580)
- Vercel: Pro ($20/month = ₹1,650)
- **Total: ~₹7,000/month**

### Production (Growing Business)
- MongoDB Atlas: M30 (~$250/month = ₹20,000)
- Render: Standard ($25/month = ₹2,000)
- Vercel: Pro ($20/month = ₹1,650)
- **Total: ~₹24,000/month**

---

## 🔗 Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Database seeded with initial data
- [ ] SSL certificates active
- [ ] CORS configured for production domain
- [ ] Error logging configured
- [ ] Backup strategy in place
- [ ] Monitoring and alerts setup
- [ ] Load testing completed
- [ ] Security audit done
- [ ] Documentation updated with live URLs

---

**Last Updated**: December 2024
