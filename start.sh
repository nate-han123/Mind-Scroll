#!/bin/bash

# Mindscroll Railway Deployment Script
echo "🚀 Starting Mindscroll deployment on Railway..."

# Set environment variables
export PORT=${PORT:-8000}
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend"

# Navigate to backend directory
cd backend

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Start the FastAPI backend
echo "🔧 Starting FastAPI backend on port $PORT..."
uvicorn main:app --host 0.0.0.0 --port $PORT --reload &

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -f http://localhost:$PORT/health > /dev/null 2>&1; then
    echo "✅ Backend started successfully!"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Keep the process running
wait
