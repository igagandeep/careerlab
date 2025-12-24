# CareerLab Deployment Guide

## Architecture
- **Frontend**: Vercel (Next.js)
- **Backend**: Render (Express.js)
- **Database**: PostgreSQL (Render/Supabase)

## Frontend Deployment (Vercel)

1. **Connect GitHub to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project" → Import `careerlab` repo

2. **Configure Build Settings:**
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Environment Variables in Vercel:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_ENVIRONMENT=production
   ```

## Backend Deployment (Render)

1. **Connect GitHub to Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New" → "Web Service"
   - Connect `careerlab` repository

2. **Configure Service:**
   - Name: `careerlab-backend`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Environment Variables in Render:**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-app.vercel.app
   ```

## Post-Deployment Steps

1. **Update Frontend API URL:**
   - Copy your Render backend URL
   - Update `NEXT_PUBLIC_API_URL` in Vercel

2. **Update Backend CORS:**
   - Copy your Vercel frontend URL  
   - Update `FRONTEND_URL` in Render

3. **Test Endpoints:**
   - Frontend: `https://your-app.vercel.app`
   - Backend Health: `https://your-backend.onrender.com/health`
   - API Test: `https://your-backend.onrender.com/api/test`

## Local Development
```bash
# Run both services
npm run dev

# Run individually  
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:5000
```