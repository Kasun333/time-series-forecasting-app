# Complete Setup & Testing Guide

## 🚀 Full Setup Instructions

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
```

If Prophet installation fails, try:
```bash
pip install pystan==2.19.1.1
pip install prophet==1.1.5
```

### Step 3: Configure Environment

```bash
# Go back to project root
cd ..

# Copy environment template
copy .env.example .env.local

# Edit .env.local
notepad .env.local
```

Set:
```env
FASTAPI_URL=http://localhost:8000
```

## 🧪 Testing the Application

### Test 1: Backend Only

**Terminal 1 - Start Backend:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

Expected output:
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Terminal 2 - Test Backend:**
```bash
cd backend
venv\Scripts\activate
python test_api.py
```

Expected output:
```
Testing FastAPI backend at http://localhost:8000

Test 1: Health Check
Status: 200
Response: {'status': 'healthy'}

Test 2: Root Endpoint
Status: 200
Response: {
  "message": "Time Series Forecasting API",
  "status": "active",
  "model": "Prophet"
}

Test 3: Prediction Endpoint
Status: 200
Method: Facebook Prophet (Additive Model)
Number of predictions: 5

Predictions:
  Time 10.00: 100.45
  Time 11.00: 101.12
  Time 12.00: 99.87
  Time 13.00: 102.34
  Time 14.00: 100.56
```

### Test 2: Full Stack (Frontend + Backend)

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Browser - Test Application:**
1. Open http://localhost:3000
2. Upload `public/sample-data.csv`
3. Set true value: `100`
4. Wait for predictions
5. Click data points to see details

## 🔍 Verification Checklist

### Backend Verification

- [ ] Backend starts without errors
- [ ] Health check returns `{"status": "healthy"}`
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Test script completes successfully
- [ ] Predictions are generated

### Frontend Verification

- [ ] Frontend starts without errors
- [ ] Page loads at http://localhost:3000
- [ ] CSV upload works
- [ ] Predictions appear on chart
- [ ] Data points are clickable
- [ ] Modal shows deviation info
- [ ] No console errors

### Integration Verification

- [ ] Frontend successfully calls backend
- [ ] Predictions display within 2-3 seconds
- [ ] Method shown: "Facebook Prophet (Additive Model)"
- [ ] Chart shows 3 lines: measured, predicted, true
- [ ] Tooltips work on hover
- [ ] Modal works on click

## 🐛 Troubleshooting

### Prophet Installation Fails

**Problem**: Error installing Prophet
**Solutions**:

**Option 1 - Install Build Tools:**
```bash
# Windows
# Install Microsoft C++ Build Tools
# https://visualstudio.microsoft.com/visual-cpp-build-tools/
```

**Option 2 - Use Conda:**
```bash
conda create -n forecast python=3.11
conda activate forecast
conda install -c conda-forge prophet
pip install fastapi uvicorn pandas pydantic
```

**Option 3 - Pre-built Wheels:**
```bash
pip install prophet --no-cache-dir
```

### Backend Won't Start

**Problem**: `uvicorn: command not found`
**Solution**:
```bash
cd backend
venv\Scripts\activate
pip install uvicorn[standard]
python main.py
```

### Frontend Can't Connect to Backend

**Problem**: `Unable to connect to prediction service`
**Check**:

1. Backend is running:
   ```bash
   curl http://localhost:8000/health
   ```

2. Environment variable is set:
   ```bash
   # Check .env.local
   notepad .env.local
   # Should contain: FASTAPI_URL=http://localhost:8000
   ```

3. Restart frontend:
   ```bash
   # Stop dev server (Ctrl+C)
   npm run dev
   ```

### CORS Errors

**Problem**: CORS policy blocks requests
**Solution**: Already configured in `backend/main.py`

If still occurs:
```python
# backend/main.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Specific origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Prophet Takes Long Time

**Issue**: First prediction is slow (10-30 seconds)
**Reason**: Prophet model fitting
**Normal**: Subsequent predictions are faster

**Optimization**:
```python
# backend/main.py - Reduce changepoint_prior_scale
model = Prophet(
    changepoint_prior_scale=0.01,  # Lower = faster
    # ...
)
```

### Port Already in Use

**Problem**: Port 8000 or 3000 in use
**Solution**:

**Backend (change port):**
```bash
uvicorn main:app --port 8001
# Update .env.local: FASTAPI_URL=http://localhost:8001
```

**Frontend (change port):**
```bash
npm run dev -- -p 3001
```

## 📊 Testing with Different Data

### Test 1: Stable Data (Low Variance)
Use `public/sample-data.csv` - values around 100

### Test 2: Trending Data
Create `test-trend.csv`:
```csv
time,measured_value
0,100
1,102
2,104
3,106
4,108
5,110
6,112
7,114
8,116
9,118
```

### Test 3: Seasonal Data
Create `test-seasonal.csv`:
```csv
time,measured_value
0,100
1,105
2,100
3,105
4,100
5,105
6,100
7,105
8,100
9,105
```

## 🔧 Development Commands

### Backend

```bash
# Start backend
cd backend
venv\Scripts\activate
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --port 8000

# Run tests
python test_api.py

# Check dependencies
pip list

# Update dependencies
pip install -r requirements.txt --upgrade
```

### Frontend

```bash
# Start frontend
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Lint code
npm run lint

# Check for errors
npm run type-check
```

## 📈 Performance Testing

### Test Backend Performance

```bash
# Install hey (HTTP load testing)
# https://github.com/rakyll/hey

# Load test
hey -n 100 -c 10 http://localhost:8000/health
```

### Monitor Resources

**Backend:**
```bash
# Windows Task Manager
# Look for: python.exe
# Monitor: CPU, Memory
```

**Frontend:**
```bash
# Browser DevTools
# Network tab
# Performance tab
```

## ✅ Production Readiness Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Backend tests pass
- [ ] Frontend builds successfully

### Configuration
- [ ] Environment variables documented
- [ ] Railway config files present
- [ ] Vercel config correct
- [ ] CORS properly configured

### Documentation
- [ ] README updated
- [ ] API endpoints documented
- [ ] Deployment guides complete
- [ ] Troubleshooting section added

### Testing
- [ ] CSV upload works
- [ ] Predictions accurate
- [ ] Charts display correctly
- [ ] Error handling works
- [ ] Mobile responsive

### Deployment
- [ ] Backend deploys to Railway
- [ ] Frontend deploys to Vercel
- [ ] Environment variables set
- [ ] HTTPS working
- [ ] API accessible

## 🎯 Success Criteria

Your setup is successful when:

1. ✅ Backend starts and responds to health checks
2. ✅ Frontend loads without errors
3. ✅ CSV upload triggers predictions
4. ✅ Chart displays all three data series
5. ✅ Clicking points shows detailed modal
6. ✅ Method shows "Facebook Prophet"
7. ✅ No console errors
8. ✅ Predictions are reasonable

## 📞 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Check browser console (F12)
4. Check backend logs in terminal
5. Verify all dependencies installed
6. Ensure correct Python/Node versions

## 🚀 Next Steps

After successful testing:

1. Read `RAILWAY_DEPLOYMENT.md` for backend deployment
2. Read `DEPLOYMENT.md` for frontend deployment
3. Configure production environment variables
4. Deploy and test in production
5. Monitor performance and errors

---

**Happy Forecasting!** 📈
