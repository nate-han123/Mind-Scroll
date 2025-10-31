# 🍃 MongoDB Atlas Setup Guide for Mind-Scroll

## 📋 Quick Setup (10 minutes)

### Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Choose **FREE tier** (M0 Sandbox - 512MB storage)

---

### Step 2: Create a Cluster

1. After signing in, click **"Build a Database"**
2. Choose **FREE Shared Cluster** (M0)
3. Select your preferred **Cloud Provider**:
   - **AWS** (Recommended)
   - **Google Cloud**
   - **Azure**
4. Choose **Region** closest to your users (e.g., `us-east-1` for USA)
5. Cluster Name: `Cluster0` (default is fine)
6. Click **"Create Cluster"** (takes 3-5 minutes)

---

### Step 3: Create Database User

1. On the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Authentication Method: **Password**
4. Username: `mindscroll_admin` (or your choice)
5. Password: Click **"Autogenerate Secure Password"** and **SAVE IT!**
   ```
   Example: K8x9mQ2pL5vN3wR7
   ```
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

---

### Step 4: Configure Network Access

1. On the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. For development/testing:
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ This is okay for now, but in production, restrict to specific IPs
4. For production:
   - Add your Railway/Vercel deployment IP addresses
5. Click **"Confirm"**

---

### Step 5: Get Connection String

1. On the left sidebar, click **"Database"** (or "Clusters")
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Python** 
5. Version: **3.11 or later** (your project uses Python 3.11)
6. Copy the connection string:
   ```
   mongodb+srv://mindscroll_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### Step 6: Update Your Application

1. Open `src/backend/.env` file
2. Replace the MongoDB URL with your connection string:
   ```env
   MONGODB_URL=mongodb+srv://mindscroll_admin:K8x9mQ2pL5vN3wR7@cluster0.xxxxx.mongodb.net/mindscroll?retryWrites=true&w=majority
   ```

**Important Changes:**
- Replace `<password>` with your actual password
- Replace `xxxxx` with your cluster ID
- Add `/mindscroll` after `.net/` (this is your database name)

**Example:**
```env
MONGODB_URL=mongodb+srv://mindscroll_admin:K8x9mQ2pL5vN3wR7@cluster0.abc123.mongodb.net/mindscroll?retryWrites=true&w=majority
```

---

### Step 7: Test the Connection

Run this test command:

```bash
cd c:\Users\hp\Desktop\Mind-Scroll\Mind-Scroll\src\backend
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import asyncio; import os; from dotenv import load_dotenv; load_dotenv(); client = AsyncIOMotorClient(os.getenv('MONGODB_URL')); asyncio.run(client.admin.command('ping')); print('✅ MongoDB Atlas connected successfully!')"
```

If successful, you'll see: `✅ MongoDB Atlas connected successfully!`

---

## 🔒 Security Best Practices

### 1. **Rotate Passwords Regularly**
- Change database password every 3-6 months
- Use strong, generated passwords

### 2. **Restrict IP Access**
- Remove "Allow from Anywhere" after testing
- Add specific IPs for production

### 3. **Use Environment Variables**
- Never commit `.env` file to Git
- `.env` is already in `.gitignore`

### 4. **Enable Monitoring**
- In Atlas Dashboard, go to **Monitoring**
- Set up alerts for unusual activity

---

## 📊 MongoDB Atlas Dashboard Overview

### Collections You'll See:

1. **users** - User profiles, goals, and authentication
2. **daily_summaries** - Daily health summaries
3. **meals** - Food tracking data
4. **exercises** - Exercise tracking data
5. **feedback** - User feedback and learning data

### Database Name: `mindscroll`

---

## 🚀 Migrate Existing Data (Optional)

If you have data in `src/backend/data/users.json`, you can migrate it:

1. **Export JSON data**
2. **Import to Atlas using MongoDB Compass:**
   - Download [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Connect using your connection string
   - Import JSON files to respective collections

---

## 💰 Pricing Tiers

### Free Tier (M0) - Current
- ✅ 512 MB storage
- ✅ Shared RAM
- ✅ Perfect for development & small apps
- ✅ Up to ~10,000 users with minimal data

### Paid Tiers (When You Scale)
- **M10**: $9/month - 2GB storage, 2GB RAM
- **M20**: $27/month - 10GB storage, 4GB RAM

---

## 🔧 Troubleshooting

### Error: "Authentication failed"
**Solution:** Double-check username and password in connection string

### Error: "Connection timeout"
**Solution:** Check Network Access settings, ensure IP is whitelisted

### Error: "Database not found"
**Solution:** Ensure `/mindscroll` is in your connection string

### Error: "SSL certificate error"
**Solution:** Update MongoDB driver:
```bash
pip install --upgrade pymongo motor
```

---

## 📱 For Railway Deployment

When deploying to Railway:

1. Go to Railway Dashboard → Your Project
2. Click **"Variables"** tab
3. Add this variable:
   ```
   MONGODB_URL=mongodb+srv://mindscroll_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mindscroll?retryWrites=true&w=majority
   ```
4. Save and redeploy

---

## ✅ Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] Free tier cluster created
- [ ] Database user created with password saved
- [ ] Network access configured (0.0.0.0/0 for now)
- [ ] Connection string copied
- [ ] `.env` file updated with connection string
- [ ] Connection tested successfully
- [ ] Application starts without errors

---

## 📞 Need Help?

- **MongoDB Docs:** [https://docs.mongodb.com/](https://docs.mongodb.com/)
- **Atlas Support:** [https://support.mongodb.com/](https://support.mongodb.com/)
- **Community Forum:** [https://community.mongodb.com/](https://community.mongodb.com/)

---

**🎉 Once complete, your Mind-Scroll app will be using MongoDB Atlas in the cloud!**

