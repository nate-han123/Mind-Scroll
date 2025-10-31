# 🚀 Quick Start: Deploy to MongoDB Atlas

## ⚡ 5-Minute Setup

### 1️⃣ Create MongoDB Atlas Account (2 min)

Go to: **https://www.mongodb.com/cloud/atlas/register**

- Sign up (free)
- Choose **FREE tier** (M0 Sandbox)
- Select region closest to you

### 2️⃣ Get Your Connection String (2 min)

1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```

### 3️⃣ Configure Your App (1 min)

Create `.env` file in `src/backend/`:

```bash
cd src/backend
```

Create `.env` file with this content:

```env
MONGODB_URL=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mindscroll?retryWrites=true&w=majority
OPENAI_API_KEY=your_openai_key_here
YOUTUBE_API_KEY=your_youtube_key_here
```

**Replace:**
- `YOUR_USERNAME` → Your Atlas username
- `YOUR_PASSWORD` → Your Atlas password
- `cluster0.xxxxx` → Your cluster address
- `your_openai_key_here` → Your OpenAI API key
- `your_youtube_key_here` → Your YouTube API key

### 4️⃣ Test Connection

```bash
cd src/backend
python test_mongodb_connection.py
```

You should see: `✅ MongoDB Atlas is ready for use!`

### 5️⃣ Start Your App

```bash
# Start backend
cd src/backend
uvicorn main:app --reload

# Start frontend (in new terminal)
cd src/frontend
npm run dev
```

---

## 🎯 Important Notes

### Network Access
In Atlas Dashboard → **Network Access**:
- Click "Add IP Address"
- Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
- This is fine for development

### Database User
In Atlas Dashboard → **Database Access**:
- Create a user with "Read and write to any database"
- Save the username and password!

---

## ✅ What You Get

- ☁️ **Cloud Database** - No local MongoDB needed
- 🔒 **Secure** - SSL/TLS encryption
- 🆓 **Free Tier** - 512MB storage (plenty to start)
- 🌍 **Global** - Access from anywhere
- 📈 **Scalable** - Upgrade when needed

---

## 🔥 Next Steps

After Atlas setup:

1. ✅ MongoDB Atlas configured
2. 🚂 Deploy backend to **Railway**
3. 🎨 Deploy frontend to **Vercel**
4. 🌐 Go live!

See **MONGODB_ATLAS_SETUP.md** for detailed instructions.

---

**Need help?** Check the detailed guide in `MONGODB_ATLAS_SETUP.md`

