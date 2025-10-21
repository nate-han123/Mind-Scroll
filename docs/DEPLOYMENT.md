# Mindscroll Deployment Guide

This guide will help you deploy the Mindscroll web application to production.

## 🏗️ Project Architecture

```
mindscroll/
├── backend/          # FastAPI Python backend
├── frontend/         # Next.js React frontend
├── DEPLOYMENT.md     # This file
├── MOBILE_GUIDE.md   # Mobile app integration guide
├── PROJECT_STRUCTURE.md # Detailed project documentation
└── README.md         # Main project documentation
```

## 🚀 Deployment Options

### Option 1: Separate Deployment (Recommended)

Deploy the backend and frontend separately for better scalability and maintenance.

#### Backend Deployment (FastAPI)

**Platform Options:**
- **Railway** (Recommended for Python)
- **Render**
- **Heroku**
- **DigitalOcean App Platform**

**Steps:**
1. **Prepare Backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Environment Variables:**
   Create a `.env` file with:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   YOUTUBE_API_KEY=your_youtube_api_key_here
   MONGODB_URL=your_mongodb_connection_string
   ```

3. **Deploy to Railway:**
   - Connect your GitHub repository
   - Set environment variables in Railway dashboard
   - Deploy automatically

4. **Update Frontend API URLs:**
   - Change `http://localhost:8000` to your deployed backend URL
   - Update in `frontend/utils/api.ts`
   - Update in `frontend/src/modules/intellectual/ReelFeed.jsx`

#### Frontend Deployment (Next.js)

**Platform Options:**
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **Railway**

**Steps:**
1. **Prepare Frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Vercel:**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `.next`
   - Deploy automatically

### Option 2: Monolithic Deployment

Deploy both backend and frontend together.

**Platform Options:**
- **Railway**
- **Render**
- **DigitalOcean App Platform**

**Steps:**
1. **Create a single Dockerfile:**
   ```dockerfile
   # Multi-stage build
   FROM node:18-alpine AS frontend-build
   WORKDIR /app/frontend
   COPY frontend/package*.json ./
   RUN npm install
   COPY frontend/ ./
   RUN npm run build

   FROM python:3.10-slim AS backend-build
   WORKDIR /app
   COPY backend/requirements.txt ./
   RUN pip install -r requirements.txt
   COPY backend/ ./
   COPY --from=frontend-build /app/frontend/.next ./frontend/.next
   COPY --from=frontend-build /app/frontend/public ./frontend/public
   COPY --from=frontend-build /app/frontend/package*.json ./frontend/

   EXPOSE 8000
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Deploy to Railway:**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically

## 🔧 Environment Setup

### Required Environment Variables

**Backend (.env):**
```env
OPENAI_API_KEY=your_openai_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
MONGODB_URL=your_mongodb_connection_string
```

**Frontend (if needed):**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Database Setup

1. **MongoDB Atlas:**
   - Create a free cluster
   - Get connection string
   - Update `MONGODB_URL` in environment variables

2. **Local MongoDB (Development):**
   ```bash
   # Install MongoDB locally
   brew install mongodb/brew/mongodb-community
   # Start MongoDB
   brew services start mongodb/brew/mongodb-community
   ```

## 📋 Pre-Deployment Checklist

- [ ] All environment variables are set
- [ ] API keys are valid and have sufficient quota
- [ ] Database connection is working
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts successfully (`uvicorn main:app --reload`)
- [ ] All tests pass (if any)
- [ ] CORS is configured for production domains
- [ ] Error handling is implemented
- [ ] Logging is configured

## 🔍 Post-Deployment Verification

1. **Backend Health Check:**
   ```bash
   curl https://your-backend-url.com/
   # Should return: {"message": "Mindscroll AI Health Pipeline API"}
   ```

2. **Frontend Health Check:**
   - Visit your frontend URL
   - Test user registration
   - Test login functionality
   - Test data entry
   - Test intellectual path

3. **API Endpoints Test:**
   ```bash
   # Test authentication
   curl -X POST https://your-backend-url.com/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   
   # Test intellectual content
   curl https://your-backend-url.com/api/intellectual/recommendations?topics=Science
   ```

## 🚨 Common Issues & Solutions

### CORS Issues
- **Problem:** Frontend can't connect to backend
- **Solution:** Update CORS settings in `backend/main.py`

### Environment Variables
- **Problem:** API keys not working
- **Solution:** Verify environment variables are set correctly in deployment platform

### Database Connection
- **Problem:** MongoDB connection fails
- **Solution:** Check connection string and network access

### Build Failures
- **Problem:** Frontend build fails
- **Solution:** Check Node.js version and dependencies

## 📊 Monitoring & Maintenance

### Health Monitoring
- Set up uptime monitoring for both frontend and backend
- Monitor API response times
- Set up error tracking (Sentry, LogRocket)

### Performance Optimization
- Enable CDN for static assets
- Implement caching strategies
- Monitor database performance

### Security
- Use HTTPS for all endpoints
- Implement rate limiting
- Regular security updates
- API key rotation

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway deploy

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
```

## 📞 Support

For deployment issues:
1. Check the logs in your deployment platform
2. Verify environment variables
3. Test locally first
4. Check API quotas and limits

## 🎯 Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure custom domains
3. Implement SSL certificates
4. Set up backup strategies
5. Plan for scaling

---

**Note:** This deployment guide assumes you have basic knowledge of web development and deployment. For platform-specific issues, refer to the official documentation of your chosen deployment platform.
