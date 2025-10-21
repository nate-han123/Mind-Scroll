# 🚂 Railway Deployment Guide for Mindscroll

## 📋 Prerequisites

1. **GitHub Repository**: Your code must be on GitHub
2. **Railway Account**: Sign up at [railway.app](https://railway.app)
3. **API Keys**: OpenAI and YouTube API keys

## 🚀 Step-by-Step Deployment

### 1. Connect to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `MindScroll` repository
5. Click **"Deploy Now"**

### 2. Configure Environment Variables

**In Railway Dashboard:**
1. Go to your project
2. Click **"Variables"** tab
3. Add these environment variables:

```bash
# Required for AI features
OPENAI_API_KEY=sk-proj-your-openai-key-here

# Required for intellectual content
YOUTUBE_API_KEY=AIzaSy-your-youtube-key-here

# Optional: MongoDB (if you want database)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/mindscroll
```

### 3. Railway Auto-Detection

Railway should automatically detect:
- ✅ **Python project** (from `src/backend/requirements.txt`)
- ✅ **Start command** (from `Procfile` or `railway.json`)
- ✅ **Health check** (from `/health` endpoint)

### 4. Manual Configuration (if needed)

If Railway doesn't auto-detect:

**Build Command:**
```bash
cd src/backend && pip install -r requirements.txt
```

**Start Command:**
```bash
cd src/backend && python railway_start.py
```

**Health Check Path:**
```
/health
```

## 🔧 Environment Variables Explained

### Required Variables

| Variable | Purpose | Where to Get |
|----------|--------|--------------|
| `OPENAI_API_KEY` | AI goal generation, food analysis | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `YOUTUBE_API_KEY` | Educational video content | [Google Cloud Console](https://console.cloud.google.com/) |

### Optional Variables

| Variable | Purpose | Default |
|----------|--------|---------|
| `MONGODB_URL` | Database connection | Local JSON files |
| `PORT` | Server port | Railway assigns automatically |

## 🌐 Accessing Your Deployed App

1. **Railway Domain**: Railway provides a URL like `https://your-app-name.railway.app`
2. **Health Check**: Visit `https://your-app-name.railway.app/health`
3. **API Endpoints**: All endpoints available at `https://your-app-name.railway.app/api/`

## 🔍 Troubleshooting

### Common Issues

**1. "Missing environment variables" warning**
- ✅ **Solution**: Add `OPENAI_API_KEY` and `YOUTUBE_API_KEY` in Railway Variables

**2. "Module not found" errors**
- ✅ **Solution**: Check that `requirements.txt` includes all dependencies

**3. "Port already in use"**
- ✅ **Solution**: Railway handles port assignment automatically

**4. "CORS errors" in frontend**
- ✅ **Solution**: Update frontend API calls to use Railway URL

### Debugging Steps

1. **Check Railway Logs**:
   - Go to Railway Dashboard > Your Project > Deployments
   - Click on latest deployment
   - View logs for errors

2. **Test Health Endpoint**:
   ```bash
   curl https://your-app-name.railway.app/health
   ```

3. **Verify Environment Variables**:
   - Check Railway Variables tab
   - Ensure no typos in variable names

## 📱 Frontend Integration

After backend deployment, update your frontend to use Railway URL:

```typescript
// In your frontend code
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.railway.app'
  : 'http://localhost:8000';
```

## 🎯 Next Steps

1. **Deploy Backend** to Railway
2. **Update Frontend** API URLs
3. **Deploy Frontend** (Vercel, Netlify, etc.)
4. **Test Full Application**

## 📞 Support

- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Project Issues**: GitHub Issues in your repository
