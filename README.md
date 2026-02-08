# Time Series Forecasting Web Application

A modern, full-stack web application built with Next.js 14 (App Router) and FastAPI for professional time-series data analysis and forecasting using Facebook Prophet. Upload CSV data, configure predictions, and visualize deviations from true values with an interactive interface.

![Time Series Forecasting App](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat-square&logo=fastapi) ![Prophet](https://img.shields.io/badge/Prophet-1.1.5-blue?style=flat-square)

## 🏗️ Architecture

```
┌─────────────────────┐         ┌──────────────────────┐
│   Next.js Frontend  │  HTTP   │  FastAPI Backend     │
│   (Vercel)          │────────▶│  (Railway)           │
│   - React UI        │         │  - Prophet Model     │
│   - Tailwind CSS    │         │  - Time Series ML    │
│   - Recharts        │         │  - REST API          │
└─────────────────────┘         └──────────────────────┘
```

## 🚀 Features

### 1. **CSV Upload**
- Drag-and-drop or click-to-browse file upload
- Automatic validation of CSV structure
- Requires `time` and `measured_value` columns
- Real-time error feedback

### 2. **True Function Input**
- Set a constant true value for comparison
- Displayed as a horizontal reference line on the chart
- Used to calculate deviation metrics

### 3. **Time-Series Forecasting**
- **Facebook Prophet** - Production-grade forecasting model
- Automatic seasonality detection
- Trend and changepoint analysis
- Configurable number of future predictions (1-100 points)
- REST API via FastAPI backend
- Railway deployment ready

### 4. **Interactive Visualization**
- Built with Recharts for responsive, interactive charts
- Three data series:
  - 📊 **Measured values** (blue line with dots)
  - 📈 **Predicted values** (green dashed line)
  - 🎯 **True value** (purple horizontal reference line)
- Smooth animations and transitions

### 5. **Data Point Analysis**
- Click any point to view detailed information
- Modal displays:
  - Time coordinate
  - Measured value
  - Predicted value (for forecasted points)
  - True value
  - Deviation from true value
- Color-coded deviation indicators (low/moderate/high)

### 6. **Modern UI/UX**
- Clean, professional design with Tailwind CSS
- Fully responsive layout (mobile, tablet, desktop)
- Gradient backgrounds and smooth transitions
- Intuitive navigation and controls
- Real-time statistics panel

### 7. **Deployment Ready**
- Frontend optimized for **Vercel** free tier
- Backend optimized for **Railway** deployment
- No external database dependencies
- Microservices architecture
- Environment variable configuration

## 📋 Requirements

**Frontend:**
- Node.js 18+ 
- npm or yarn or pnpm

**Backend:**
- Python 3.11+
- pip

## 🛠️ Installation

### 1. Clone or navigate to the project directory:
```bash
cd "c:\Users\PC\Desktop\Research-Sadeep Ayya"
```

### 2. Install Frontend Dependencies:
```bash
npm install
```

### 3. Install Backend Dependencies:
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
cd ..
```

### 4. Configure Environment:
```bash
copy .env.example .env.local
```

Edit `.env.local` and set:
```env
FASTAPI_URL=http://localhost:8000
```

### 5. Run the Application:

**Terminal 1 - Start Backend (FastAPI):**
```bash
cd backend
venv\Scripts\activate
python main.py
```

**Terminal 2 - Start Frontend (Next.js):**
```bash
npm run dev
```

### 6. Open your browser:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📦 Project Structure

```
Research-Sadeep Ayya/
├── app/
│   ├── api/
│   │   └── predict/
│   │       └── route.ts          # Proxy to FastAPI backend
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── backend/                      # FastAPI Backend
│   ├── main.py                   # FastAPI app with Prophet
│   ├── requirements.txt          # Python dependencies
│   ├── Procfile                  # Railway deployment
│   ├── railway.json              # Railway config
│   ├── runtime.txt               # Python version
│   └── README.md                 # Backend docs
├── components/
│   ├── CSVUploader.tsx           # File upload component
│   ├── TrueValueInput.tsx        # Configuration inputs
│   ├── ChartViewer.tsx           # Interactive chart
│   └── DataPointModal.tsx        # Detail modal
├── types/
│   └── index.ts                  # TypeScript interfaces
├── public/
│   └── sample-data.csv           # Example CSV file
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── .env.example                  # Environment template
├── README.md                     # Main documentation
├── RAILWAY_DEPLOYMENT.md         # Railway deploy guide
└── DEPLOYMENT.md                 # Vercel deploy guide
```

## 📊 CSV Format

Your CSV file must contain exactly two columns:

```csv
time,measured_value
0,98.5
1,101.2
2,99.8
...
```

- **time**: Numeric timestamp or time index
- **measured_value**: Numeric measured value at that time

A sample CSV file is provided in `public/sample-data.csv`.

## 🔧 Configuration Options

### Number of Predictions
- Range: 1-100 future points
- Default: 10
- Adjustable in the configuration panel

### True Value
- Enter any numeric value
- Used as reference for deviation calculations
- Displayed as horizontal line on chart

## 🚀 Deployment

### Deploy Backend to Railway

See detailed instructions in [`RAILWAY_DEPLOYMENT.md`](RAILWAY_DEPLOYMENT.md)

**Quick steps:**
1. Push code to GitHub
2. Create Railway project from GitHub repo
3. Railway auto-detects Python app
4. Get your Railway URL

### Deploy Frontend to Vercel

See detailed instructions in [`DEPLOYMENT.md`](DEPLOYMENT.md)

**Quick steps:**
1. Set `FASTAPI_URL` environment variable in Vercel
2. Connect GitHub repo to Vercel
3. Deploy

### Environment Variables

**Frontend (.env.local):**
```env
FASTAPI_URL=https://your-railway-app.up.railway.app
```

**Backend:**
- No additional variables needed
- Railway sets `PORT` automatically

## 🧮 Prediction Algorithm

The forecasting uses **Facebook Prophet**:

### What is Prophet?

- Open-source forecasting tool by Meta (Facebook)
- Designed for business time series with strong seasonal effects
- Handles missing data and outliers automatically
- Provides uncertainty intervals
- Fast and fully automatic

### How It Works

1. **Trend Detection**: Identifies long-term patterns
2. **Seasonality**: Captures repeating patterns
3. **Changepoints**: Detects shifts in trends
4. **Forecasting**: Generates future predictions with confidence intervals

### Configuration

```python
Prophet(
    changepoint_prior_scale=0.05,  # Trend flexibility
    seasonality_mode='additive',    # How seasonality combines
    interval_width=0.95             # 95% confidence intervals
)
```

### Why Prophet?

✅ **Production-ready** - Used by Facebook, Uber, etc.  
✅ **Robust** - Handles missing data and outliers  
✅ **Automatic** - No manual parameter tuning needed  
✅ **Accurate** - State-of-the-art forecasting  
✅ **Fast** - Predictions in seconds  

### Alternatives

The previous lightweight JS algorithm is available in git history if you need a serverless-only solution.

## 🎨 Customization

### Styling
Modify `tailwind.config.ts` to change colors, spacing, etc.

### Prediction Model
Edit `app/api/predict/route.ts` to implement different forecasting algorithms.

### Chart Appearance
Customize chart colors and styles in `components/ChartViewer.tsx`.

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: Single column layout
- **Tablet**: Optimized spacing
- **Desktop**: Three-column grid layout

## 🧪 Testing with Sample Data

1. Use the provided `public/sample-data.csv`
2. Upload it through the interface
3. Set true value to `100`
4. Observe predictions and deviations

## 🔍 How to Use

1. **Upload CSV**: Drag and drop or click to upload your CSV file
2. **Set True Value**: Enter the constant true function value
3. **Configure Predictions**: Choose how many future points to predict
4. **Analyze Chart**: View the interactive visualization
5. **Click Points**: Click any data point for detailed information
6. **Review Stats**: Check the statistics panel for data summary

## 📄 License

This project is open source and available for educational and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 💡 Tips

- Use at least 10 data points for better predictions
- The algorithm works best with trend-based data
- Adjust the number of predictions based on your data density
- Click on predicted points to see forecast values

## 🐛 Troubleshooting

### CSV Upload Fails
- Ensure columns are named exactly `time` and `measured_value`
- Check that all values are numeric
- Verify the file is a valid CSV

### Predictions Not Generated
- Need at least 2 data points
- Check browser console for errors
- Ensure API route is accessible

### Chart Not Displaying
- Verify data is loaded (check statistics panel)
- Try refreshing the page
- Check browser console for errors

## 📞 Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ using Next.js 14, TypeScript, Tailwind CSS, and Recharts
