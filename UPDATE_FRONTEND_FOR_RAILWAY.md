# 🔗 Connect Frontend to Railway Backend

## Your Backend is Live! 🎉

Now let's update your frontend to use the Railway backend URL instead of localhost.

---

## 📝 Files to Update

You need to replace `http://localhost:8000` with your Railway URL in these files:

### 1. `src/frontend/utils/api.ts`
### 2. `src/frontend/pages/data-entry.tsx`
### 3. `src/frontend/pages/dashboard.tsx`
### 4. `src/frontend/pages/login.tsx`
### 5. `src/frontend/pages/essential-signup.tsx`
### 6. `src/frontend/pages/comprehensive-profile.tsx`
### 7. `src/frontend/src/modules/intellectual/ReelFeed.jsx`

---

## 🔧 How to Update

### Option A: Manual Update (Quick)

1. **Open each file listed above**
2. **Find**: `http://localhost:8000`
3. **Replace with**: `https://your-railway-url.up.railway.app`
4. **Save all files**

### Option B: Use Environment Variable (Better)

1. Create `src/frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
   ```

2. Update each file to use the env variable:
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
   
   // Then use API_URL instead of hardcoded URL
   fetch(`${API_URL}/api/endpoint`, ...)
   ```

---

## ✅ Test Your Frontend Locally

After updating:

```bash
cd src/frontend
npm run dev
```

Then test:
- Signup
- Login
- Data entry
- AI analysis

Everything should now work with your live Railway backend!

---

## 🚀 Option: Deploy Frontend to Vercel

Once frontend is working locally with Railway backend:

1. Go to https://vercel.com/
2. Import your GitHub repo
3. Set Root Directory: `src/frontend`
4. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-url.up.railway.app
   ```
5. Deploy!

---

## 🎯 Your Complete Stack

After all deployments:

**Backend (Railway)**: https://your-app.up.railway.app  
**Frontend (Vercel)**: https://your-app.vercel.app  
**Database**: MongoDB Atlas ☁️  

**All in the cloud!** 🌍

---

## 📋 Quick Checklist

- [ ] Got Railway URL
- [ ] Tested /health endpoint
- [ ] Tested /docs endpoint  
- [ ] Updated frontend files with Railway URL
- [ ] Tested frontend locally with Railway backend
- [ ] (Optional) Deployed frontend to Vercel

---

**Need help with any step?** Let me know!

