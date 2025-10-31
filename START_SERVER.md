# Start Mind-Scroll Backend Server

## Quick Start

### Windows
```bash
cd c:\Users\hp\Desktop\Mind-Scroll\Mind-Scroll\src\backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Mac/Linux
```bash
cd ~/Mind-Scroll/src/backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## You Should See:
```
INFO:     Started server process
INFO:     Waiting for application startup.
[INFO] Feedback learning service initialized
[INFO] Simple food analyzer initialized
[SUCCESS] Connected to MongoDB Atlas - All data will be stored in the cloud!
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

## Access Your API

- **Base URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Test Signup

You can now create new accounts and all data will be stored in MongoDB Atlas!

## Frontend

Start your frontend in a separate terminal:
```bash
cd c:\Users\hp\Desktop\Mind-Scroll\Mind-Scroll\src\frontend
npm run dev
```

Then access: http://localhost:3000

