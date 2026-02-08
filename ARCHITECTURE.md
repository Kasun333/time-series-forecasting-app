# Architecture Documentation

## System Overview

A microservices-based time-series forecasting application with separated frontend and backend services.

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Frontend (Vercel)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Components                                       │ │
│  │  - CSVUploader: File handling & validation            │ │
│  │  - ChartViewer: Recharts visualization               │ │
│  │  - TrueValueInput: Configuration                      │ │
│  │  - DataPointModal: Detail display                     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Route (Proxy)                                     │ │
│  │  /app/api/predict/route.ts                            │ │
│  │  - Validates requests                                  │ │
│  │  - Forwards to FastAPI backend                        │ │
│  │  - Handles errors                                      │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP POST
                         │ /api/predict
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  FastAPI Backend (Railway)                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  REST API Endpoints                                     │ │
│  │  GET  /         - Health check                         │ │
│  │  GET  /health   - Status endpoint                      │ │
│  │  POST /api/predict - Forecasting                       │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Prophet ML Model                                       │ │
│  │  - Data preprocessing                                   │ │
│  │  - Model training                                       │ │
│  │  - Prediction generation                                │ │
│  │  - Confidence intervals                                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend (Next.js)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | Next.js 14 | React framework with App Router |
| Language | TypeScript | Type safety |
| Styling | Tailwind CSS | Utility-first CSS |
| Charts | Recharts | Data visualization |
| CSV Parsing | PapaParse | Client-side CSV processing |
| Icons | Lucide React | Icon library |
| Deployment | Vercel | Hosting platform |

### Backend (FastAPI)

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Framework | FastAPI | High-performance API |
| Language | Python 3.11 | Backend logic |
| ML Model | Prophet 1.1.5 | Time-series forecasting |
| Data Processing | Pandas | Data manipulation |
| Validation | Pydantic | Request/response models |
| Server | Uvicorn | ASGI server |
| Deployment | Railway | Hosting platform |

## Data Flow

### 1. CSV Upload Flow

```
User uploads CSV
    ↓
CSVUploader.tsx validates format
    ↓
PapaParse parses CSV
    ↓
Data stored in React state
    ↓
Triggers prediction request
```

### 2. Prediction Request Flow

```
User uploads data
    ↓
Frontend: app/page.tsx
    ↓
API Route: /app/api/predict/route.ts
    │
    ├─ Validates request
    ├─ Checks data points >= 2
    ├─ Checks numPredictions (1-100)
    │
    ↓ HTTP POST
    │
FastAPI Backend: /api/predict
    │
    ├─ Converts data to Prophet format
    ├─ Creates DataFrame (ds, y columns)
    ├─ Initializes Prophet model
    ├─ Fits model to data
    ├─ Generates predictions
    ├─ Returns JSON response
    │
    ↓ HTTP Response
    │
API Route: Forwards response
    ↓
Frontend: Updates state
    ↓
ChartViewer: Renders predictions
```

### 3. Data Point Click Flow

```
User clicks chart point
    ↓
ChartViewer.tsx: handleDotClick
    ↓
Creates ClickedPointData object
    ↓
Calls onPointClick callback
    ↓
app/page.tsx: setSelectedPoint
    ↓
DataPointModal.tsx: Displays modal
    │
    ├─ Shows time coordinate
    ├─ Shows measured/predicted value
    ├─ Shows true value
    ├─ Calculates deviation
    ├─ Color codes severity
```

## API Contracts

### POST /api/predict

**Request:**
```typescript
{
  data: Array<{
    time: number;
    measured_value: number;
  }>;
  numPredictions: number; // 1-100
}
```

**Response:**
```typescript
{
  predictions: Array<{
    time: number;
    predicted_value: number;
  }>;
  method: string; // "Facebook Prophet (Additive Model)"
}
```

**Error Response:**
```typescript
{
  error: string;
  detail?: string;
}
```

## Component Architecture

### Frontend Components

```
app/page.tsx (Main Container)
    │
    ├── CSVUploader
    │   └── Handles: File upload, validation, parsing
    │
    ├── TrueValueInput
    │   └── Handles: True value input, prediction count
    │
    ├── ChartViewer
    │   ├── Recharts LineChart
    │   ├── CustomDot (clickable points)
    │   ├── CustomTooltip
    │   └── ReferenceLine (true value)
    │
    └── DataPointModal
        └── Displays: Time, values, deviation
```

### Backend Structure

```
backend/
    │
    ├── main.py
    │   ├── FastAPI app instance
    │   ├── CORS middleware
    │   ├── Route handlers
    │   └── Prophet integration
    │
    ├── requirements.txt
    │   └── Python dependencies
    │
    └── Deployment files
        ├── Procfile
        ├── railway.json
        └── runtime.txt
```

## State Management

### Frontend State (React)

```typescript
// app/page.tsx
const [data, setData] = useState<DataPoint[]>([]);
const [predictions, setPredictions] = useState<PredictedPoint[]>([]);
const [trueValue, setTrueValue] = useState<number | null>(null);
const [numPredictions, setNumPredictions] = useState<number>(10);
const [selectedPoint, setSelectedPoint] = useState<ClickedPointData | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string>('');
const [predictionMethod, setPredictionMethod] = useState<string>('');
```

### Backend State

- Stateless API
- No session storage
- Each request is independent
- Prophet model created per request

## Security Considerations

### Frontend
- ✅ CSV parsing on client-side (no file upload to server)
- ✅ Input validation before API calls
- ✅ XSS protection via React
- ✅ Environment variables for API URL

### Backend
- ✅ CORS configured for allowed origins
- ✅ Request validation with Pydantic
- ✅ Error handling with proper status codes
- ✅ No user authentication required (public API)
- ✅ Rate limiting recommended (Railway level)

### Production Recommendations
- [ ] Add API authentication
- [ ] Implement rate limiting
- [ ] Add request logging
- [ ] Monitor API usage
- [ ] Set specific CORS origins

## Performance Optimization

### Frontend
- ✅ Code splitting (Next.js automatic)
- ✅ Image optimization (Next.js automatic)
- ✅ Static generation where possible
- ✅ Client-side CSV parsing (no server upload)
- ✅ Lazy loading for charts

### Backend
- ✅ Efficient Prophet configuration
- ✅ Pandas vectorization
- ✅ Minimal dependencies
- ⚠️ Prophet model created per request
- 💡 Future: Cache models for identical datasets

## Scaling Considerations

### Current Architecture
- Frontend: Scales automatically on Vercel
- Backend: Single Railway instance

### Future Scaling Options

**Option 1: Horizontal Scaling**
```
Load Balancer
    ├── FastAPI Instance 1
    ├── FastAPI Instance 2
    └── FastAPI Instance 3
```

**Option 2: Caching Layer**
```
Frontend → Redis Cache → FastAPI → Prophet
```

**Option 3: Async Processing**
```
Frontend → Job Queue → Worker Pool → Prophet
```

## Error Handling

### Frontend Errors
- CSV validation errors → User-friendly messages
- API connection errors → Retry suggestions
- Timeout errors → Service unavailable message

### Backend Errors
- 400: Bad Request (invalid data format)
- 500: Internal Server Error (Prophet failure)
- 503: Service Unavailable (backend offline)

## Monitoring & Logging

### Frontend (Vercel)
- Automatic deployment logs
- Runtime error tracking
- Analytics dashboard

### Backend (Railway)
- Real-time logs: `railway logs`
- CPU/Memory monitoring
- Deployment history
- Custom logging in main.py

## Testing Strategy

### Frontend Testing
```bash
npm run lint        # ESLint
npm run build       # Build validation
```

### Backend Testing
```bash
# Manual testing
curl http://localhost:8000/health

# API documentation
http://localhost:8000/docs
```

### Integration Testing
1. Start both services locally
2. Upload sample CSV
3. Verify predictions displayed
4. Test data point clicks
5. Check error handling

## Development Workflow

### Local Development

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

**Terminal 3 - Testing:**
```bash
curl http://localhost:8000/health
```

### Deployment Workflow

```
Development
    ↓
Git commit
    ↓
Push to GitHub
    ↓ (triggers)
    ├── Vercel: Frontend deploy
    └── Railway: Backend deploy
    ↓
Production
```

## Environment Configuration

### Development
```env
# .env.local
FASTAPI_URL=http://localhost:8000
```

### Production (Vercel)
```env
FASTAPI_URL=https://your-railway-app.up.railway.app
```

### Railway
```env
PORT=8000  # Auto-set by Railway
```

## Future Enhancements

### High Priority
- [ ] Add authentication
- [ ] Implement caching
- [ ] Add confidence intervals to UI
- [ ] Support multiple CSV uploads
- [ ] Export predictions to CSV

### Medium Priority
- [ ] Historical prediction comparison
- [ ] Model performance metrics
- [ ] Custom Prophet parameters
- [ ] Batch prediction endpoint
- [ ] WebSocket for real-time updates

### Low Priority
- [ ] Dark mode
- [ ] Multiple forecasting models
- [ ] A/B testing framework
- [ ] Mobile app
- [ ] Email notifications

## Cost Analysis

### Development: $0/month
- Vercel: Free tier
- Railway: Free credits
- GitHub: Free

### Production: ~$5-10/month
- Vercel: $0 (free tier sufficient)
- Railway: $5-10 (depends on usage)
- Domain (optional): $12/year

## Support & Documentation

- **Main README**: `README.md`
- **Railway Deployment**: `RAILWAY_DEPLOYMENT.md`
- **Vercel Deployment**: `DEPLOYMENT.md`
- **Backend API**: `backend/README.md`
- **Quick Start**: `QUICKSTART.md`
- **This Document**: `ARCHITECTURE.md`

---

**Architecture Version**: 2.0  
**Last Updated**: February 2026  
**Status**: ✅ Production Ready
