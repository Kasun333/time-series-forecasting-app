# Quick Start Guide

## 🚀 Get Started in 5 Steps

### Step 1: Install Frontend Dependencies
```bash
cd "c:\Users\PC\Desktop\Research-Sadeep Ayya"
npm install
```

### Step 2: Install Backend Dependencies
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 3: Configure Environment
```bash
copy .env.example .env.local
```

Edit `.env.local`:
```env
FASTAPI_URL=http://localhost:8000
```

### Step 4: Start Backend
**Terminal 1:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

Backend runs at: **http://localhost:8000**

### Step 5: Start Frontend
**Terminal 2:**
```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## 📝 First Time Usage

1. **Open Browser**
   - Navigate to: **http://localhost:3000**

2. **Upload CSV File**
   - Drag `public/sample-data.csv` or click to browse
   - CSV must have `time` and `measured_value` columns

3. **Set True Value**
   - Enter `100` in the "True Function Value" field

4. **Configure Predictions**
   - Leave default (10) or choose 1-100

5. **View Results**
   - Blue line = Measured values
   - Green dashed line = Predicted values (Prophet)
   - Purple horizontal line = True value

6. **Click Data Points**
   - Click any point to see detailed information
   - View time, values, and deviation

---

## 📊 Sample CSV Format

Create a file with this structure:
```csv
time,measured_value
0,98.5
1,101.2
2,99.8
3,102.5
```

---

## 🎯 Available Commands

### Backend Commands
```bash
cd backend
venv\Scripts\activate

# Start server
python main.py

# Or with uvicorn
uvicorn main:app --reload --port 8000

# Test API
python test_api.py

# View API docs
# http://localhost:8000/docs
```

### Frontend Commands
```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

---

## 🔧 Troubleshooting

### Prophet Installation Issues?
```bash
# Try installing build dependencies first
pip install pystan==2.19.1.1
pip install prophet==1.1.5

# Or use conda
conda install -c conda-forge prophet
```

### Port 8000 already in use?
```bash
# Change backend port
uvicorn main:app --port 8001

# Update .env.local
FASTAPI_URL=http://localhost:8001
```

### Frontend can't connect?
1. Ensure backend is running
2. Check `.env.local` has correct URL
3. Restart frontend: Ctrl+C then `npm run dev`

### First prediction slow?
- Prophet model fitting takes 5-15 seconds initially
- Subsequent predictions are faster
- This is normal behavior

---

## 🌐 Deploy to Production

### Deploy Backend (Railway)

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. Create new project from GitHub repo
4. Railway auto-detects Python app
5. Get your Railway URL

**See:** `RAILWAY_DEPLOYMENT.md` for details

### Deploy Frontend (Vercel)

1. Set environment variable in Vercel:
   - `FASTAPI_URL` = `https://your-railway-app.up.railway.app`
2. Connect GitHub repository
3. Deploy automatically

**See:** `DEPLOYMENT.md` for details

---

## ✅ Verify Installation

Run these checks:

```bash
# 1. Check Node.js (should be 18+)
node --version

# 2. Check Python (should be 3.11+)
python --version

# 3. Test backend
curl http://localhost:8000/health

# 4. Check frontend
# Open http://localhost:3000 in browser
```

Expected responses:
- Backend: `{"status": "healthy"}`
- Frontend: Application loads

---

## 💡 Pro Tips

- **Sample Data**: Use `public/sample-data.csv` for testing
- **True Value**: Try `100` to see clear deviations
- **Predictions**: Start with 10, experiment with more
- **Mobile**: App is fully responsive on all devices
- **API Docs**: Visit http://localhost:8000/docs for interactive API documentation
- **Errors**: Check browser console (F12) for details

---

## 📚 Documentation

| Guide | Purpose |
|-------|---------|
| `README.md` | Main documentation |
| `SETUP_TESTING.md` | Detailed setup and testing |
| `RAILWAY_DEPLOYMENT.md` | Backend deployment |
| `DEPLOYMENT.md` | Frontend deployment |
| `ARCHITECTURE.md` | System design |
| `PROJECT_COMPLETE.md` | Complete summary |

---

## 🧪 Test the Application

### Quick Test

1. Start both servers (backend + frontend)
2. Open http://localhost:3000
3. Upload `public/sample-data.csv`
4. Set true value: `100`
5. Wait for predictions (5-15 seconds)
6. Click on data points

### Expected Results

- ✅ Chart displays 3 lines
- ✅ Predictions appear smoothly
- ✅ Method shows "Facebook Prophet"
- ✅ Modal shows deviation on click
- ✅ No console errors

---

## 🎉 You're Ready!

Your application is now running:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

**Happy Forecasting!** 📈
