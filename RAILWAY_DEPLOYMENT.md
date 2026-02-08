# Railway Deployment Guide - FastAPI Backend

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│   Next.js App   │  HTTP   │  FastAPI Backend │
│   (Vercel)      │────────▶│   (Railway)      │
│                 │         │  Prophet Model   │
└─────────────────┘         └──────────────────┘
```

## Prerequisites

- Railway account (https://railway.app)
- GitHub account
- Python 3.11+
- Node.js 18+

## Step 1: Deploy FastAPI Backend to Railway

### Option A: Deploy from GitHub (Recommended)

1. **Push backend code to GitHub**
   ```bash
   cd "c:\Users\PC\Desktop\Research-Sadeep Ayya"
   git init
   git add .
   git commit -m "Initial commit with FastAPI backend"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Create Railway Project**
   - Go to https://railway.app
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect the Python app

3. **Configure Railway**
   - Go to your project settings
   - Click "Settings" → "Environment"
   - Railway will automatically detect `backend/requirements.txt`
   - Set root directory to `/backend` if needed

4. **Set Start Command**
   - In Railway dashboard, go to Settings
   - Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Or let Railway use the Procfile

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (may take 5-10 minutes for Prophet)
   - Get your Railway URL (e.g., `https://your-app.up.railway.app`)

### Option B: Deploy via Railway CLI

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd backend
   railway init
   ```

4. **Deploy**
   ```bash
   railway up
   ```

5. **Get URL**
   ```bash
   railway domain
   ```

## Step 2: Configure Next.js Environment

1. **Create `.env.local` file**
   ```bash
   cd "c:\Users\PC\Desktop\Research-Sadeep Ayya"
   copy .env.example .env.local
   ```

2. **Update `.env.local`**
   ```env
   FASTAPI_URL=https://your-railway-app.up.railway.app
   ```

3. **For local development**, run both servers:
   
   **Terminal 1 - FastAPI:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```
   
   **Terminal 2 - Next.js:**
   ```bash
   npm run dev
   ```

## Step 3: Deploy Next.js to Vercel

1. **Add environment variable in Vercel**
   - Go to Vercel dashboard
   - Select your project
   - Settings → Environment Variables
   - Add: `FASTAPI_URL` = `https://your-railway-app.up.railway.app`

2. **Deploy**
   ```bash
   vercel --prod
   ```

## Testing the Setup

### Test FastAPI Backend

```bash
# Health check
curl https://your-railway-app.up.railway.app/health

# Test prediction
curl -X POST https://your-railway-app.up.railway.app/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "data": [
      {"time": 0, "measured_value": 100},
      {"time": 1, "measured_value": 101},
      {"time": 2, "measured_value": 99}
    ],
    "numPredictions": 5
  }'
```

### Test Full Integration

1. Open your Next.js app
2. Upload CSV file
3. Check browser console for API calls
4. Verify predictions are displayed

## Troubleshooting

### Railway Build Fails

**Problem**: Prophet installation timeout
**Solution**: 
- Prophet can take 5-10 minutes to install
- Increase Railway build timeout if needed
- Check Railway build logs

### CORS Errors

**Problem**: Frontend can't connect to backend
**Solution**:
- Ensure CORS is configured in FastAPI (already done in `main.py`)
- Check Railway URL is correct in `.env.local`

### Connection Refused

**Problem**: Cannot connect to FastAPI
**Solution**:
- Verify Railway app is running
- Check `FASTAPI_URL` environment variable
- Test direct API access with curl

### Prophet Import Error

**Problem**: `ModuleNotFoundError: No module named 'prophet'`
**Solution**:
```bash
pip install prophet --upgrade
```

## Railway Configuration Files

### `Procfile`
```
web: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### `railway.json`
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
  }
}
```

### `requirements.txt`
```
fastapi==0.109.2
uvicorn[standard]==0.27.1
prophet==1.1.5
pandas==2.2.0
pydantic==2.6.1
numpy==1.26.4
```

## Cost Estimation

### Railway (Free Tier)
- $5 free credit monthly
- Prophet backend typically uses 1-2GB RAM
- Estimated cost: $0-5/month

### Vercel (Free Tier)
- 100GB bandwidth
- Unlimited deployments
- Cost: $0/month

## Local Development

### Start Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Start Frontend
```bash
# In another terminal
npm run dev
```

### Test Locally
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

## Monitoring

### Railway Dashboard
- View logs in real-time
- Monitor CPU/Memory usage
- Check deployment history

### Logs
```bash
railway logs
```

## Updating the Backend

```bash
# Make changes to backend/main.py
git add .
git commit -m "Update backend"
git push origin main

# Railway will auto-deploy
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `FASTAPI_URL` | FastAPI backend URL | `https://app.up.railway.app` |
| `PORT` | Railway port (auto-set) | `8000` |

## Support

- Railway Docs: https://docs.railway.app
- FastAPI Docs: https://fastapi.tiangolo.com
- Prophet Docs: https://facebook.github.io/prophet

---

**Status**: ✅ Production Ready  
**Prophet Model**: Facebook Prophet  
**Backend**: FastAPI on Railway  
**Frontend**: Next.js on Vercel
