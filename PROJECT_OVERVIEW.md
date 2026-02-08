# Project Overview: Time Series Forecasting Web Application

## 🎯 Project Summary

A full-stack Next.js 14 application for time-series data analysis and forecasting. Users can upload CSV data, configure predictions, and visualize deviations from true values through an interactive interface.

## 📁 Complete File Structure

```
Research-Sadeep Ayya/
│
├── app/                           # Next.js 14 App Router
│   ├── api/
│   │   └── predict/
│   │       └── route.ts          # Prediction API (POST endpoint)
│   ├── globals.css               # Global Tailwind styles
│   ├── layout.tsx                # Root layout component
│   └── page.tsx                  # Main page (home)
│
├── components/                    # React components
│   ├── CSVUploader.tsx           # File upload with drag-drop
│   ├── TrueValueInput.tsx        # Configuration panel
│   ├── ChartViewer.tsx           # Interactive Recharts visualization
│   └── DataPointModal.tsx        # Detail modal on point click
│
├── types/
│   └── index.ts                  # TypeScript type definitions
│
├── public/
│   └── sample-data.csv           # Example CSV for testing
│
├── node_modules/                 # Dependencies (after npm install)
│
├── .next/                        # Next.js build output (generated)
│
├── package.json                  # Project dependencies & scripts
├── package-lock.json             # Locked dependency versions
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS for Tailwind
├── next.config.js                # Next.js configuration
├── .eslintrc.json                # ESLint rules
├── .gitignore                    # Git ignore patterns
├── .env.example                  # Environment variables template
├── vercel.json                   # Vercel deployment config
├── README.md                     # Main documentation
└── DEPLOYMENT.md                 # Deployment instructions
```

## 🔧 Technology Stack

### Frontend
- **Next.js 14.2.3** - React framework with App Router
- **React 18.3.1** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **Recharts 2.12.7** - Chart visualization
- **Lucide React** - Icon library

### Data Processing
- **PapaParse 5.4.1** - CSV parsing

### Development
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🎨 Key Components

### 1. CSVUploader (`components/CSVUploader.tsx`)
- **Purpose**: File upload with validation
- **Features**:
  - Drag-and-drop interface
  - CSV format validation
  - Error handling and feedback
  - Automatic data parsing and sorting
- **Props**:
  - `onDataLoaded`: Callback with parsed data

### 2. TrueValueInput (`components/TrueValueInput.tsx`)
- **Purpose**: Configuration panel
- **Features**:
  - True value input (number)
  - Number of predictions selector (1-100)
  - Real-time validation
- **Props**:
  - `value`, `onChange`: True value state
  - `numPredictions`, `onNumPredictionsChange`: Prediction count state

### 3. ChartViewer (`components/ChartViewer.tsx`)
- **Purpose**: Interactive data visualization
- **Features**:
  - Three data series (measured, predicted, true)
  - Clickable data points
  - Custom tooltips
  - Responsive design
  - Color-coded legend
- **Props**:
  - `data`: Chart data points
  - `trueValue`: Constant reference line
  - `onPointClick`: Click handler

### 4. DataPointModal (`components/DataPointModal.tsx`)
- **Purpose**: Detailed point information
- **Features**:
  - Modal overlay
  - Time, measured, predicted, true values
  - Deviation calculation
  - Color-coded deviation severity
- **Props**:
  - `data`: Selected point data
  - `onClose`: Close handler

### 5. Main Page (`app/page.tsx`)
- **Purpose**: Application orchestration
- **Features**:
  - State management
  - API communication
  - Layout composition
  - Statistics panel
  - Loading states
  - Error handling

## 🔌 API Routes

### POST `/api/predict`

**Purpose**: Generate time-series predictions

**Request Body**:
```typescript
{
  data: Array<{ time: number, measured_value: number }>,
  numPredictions: number
}
```

**Response**:
```typescript
{
  predictions: Array<{ time: number, predicted_value: number }>,
  method: string
}
```

**Algorithm**:
1. Linear regression for trend detection
2. Moving average for smoothing
3. Adaptive weighting based on variance
4. Damping factor to prevent over-extrapolation

## 📊 Data Flow

```
CSV Upload
    ↓
Validation & Parsing (PapaParse)
    ↓
State Update (React)
    ↓
API Call (/api/predict)
    ↓
Prediction Generation (Linear Regression + Moving Average)
    ↓
Chart Rendering (Recharts)
    ↓
Interactive Visualization
    ↓
Point Click → Modal Display
```

## 🎯 Core Features Implementation

### 1. CSV Upload
- **File**: `components/CSVUploader.tsx`
- **Validation**: Column names, data types, minimum rows
- **Parsing**: PapaParse with header detection

### 2. True Function Input
- **File**: `components/TrueValueInput.tsx`
- **Storage**: React state (number | null)
- **Usage**: Reference line on chart, deviation calculation

### 3. Prediction Model
- **File**: `app/api/predict/route.ts`
- **Method**: Hybrid linear regression + moving average
- **Features**: Trend detection, noise smoothing, damping

### 4. Interactive Graphs
- **File**: `components/ChartViewer.tsx`
- **Library**: Recharts
- **Features**: Click events, tooltips, legends, animations

### 5. Data Point Click
- **Files**: `ChartViewer.tsx`, `DataPointModal.tsx`
- **Display**: Time, measured, predicted, true, deviation
- **UI**: Modal with color-coded severity

### 6. UI/UX
- **Styling**: Tailwind CSS
- **Layout**: Responsive grid (mobile/tablet/desktop)
- **Design**: Modern gradient backgrounds, smooth transitions

### 7. Architecture
- **Frontend**: Next.js pages with React components
- **Backend**: Next.js API routes
- **Data**: In-memory (no database)

### 8. Deployment
- **Platform**: Vercel
- **Config**: `vercel.json`
- **Requirements**: Node.js 18+, no external services

### 9. Code Quality
- **Language**: TypeScript
- **Types**: `types/index.ts`
- **Linting**: ESLint with Next.js config
- **Structure**: Modular components

### 10. Extras
- ✅ Configurable prediction count (1-100)
- ✅ CSV format validation
- ✅ Error messages with icons
- ✅ Statistics panel
- ✅ Sample CSV file
- ✅ Loading states
- ✅ Responsive design

## 🚀 Running the Application

### Development
```bash
npm install
npm run dev
```
Visit: http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📦 Dependencies Explained

### Production
- `next`: Framework
- `react`, `react-dom`: UI library
- `recharts`: Charts
- `papaparse`: CSV parsing
- `lucide-react`: Icons

### Development
- `typescript`: Type checking
- `@types/*`: Type definitions
- `tailwindcss`: Styling
- `eslint`: Linting
- `postcss`, `autoprefixer`: CSS processing

## 🔐 Security Considerations

- No authentication required (public app)
- Client-side CSV parsing (no file upload to server)
- Input validation on API routes
- No external database connections
- CORS handled by Next.js
- XSS protection via React

## 🎯 Testing the Application

1. Start dev server: `npm run dev`
2. Open: http://localhost:3000
3. Upload `public/sample-data.csv`
4. Set true value: `100`
5. Set predictions: `10`
6. Click data points to see details

## 📈 Future Enhancements (Optional)

- [ ] Multiple CSV file support
- [ ] Export predictions to CSV
- [ ] More forecasting algorithms
- [ ] User authentication
- [ ] Database storage
- [ ] Historical prediction comparison
- [ ] Real-time data streaming
- [ ] Dark mode toggle

## 🐛 Known Limitations

- Maximum 100 predictions (configurable)
- Client-side processing only
- No persistent storage
- Single CSV file at a time
- Simple forecasting algorithm

## 📞 Support

For issues:
1. Check `README.md`
2. Review `DEPLOYMENT.md`
3. Check browser console
4. Review Vercel logs (if deployed)

---

**Built by**: Research Team  
**Framework**: Next.js 14  
**License**: Open Source  
**Status**: Production Ready ✅
