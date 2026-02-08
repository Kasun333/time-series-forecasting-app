# Time Series Forecasting Backend

FastAPI backend with Facebook Prophet for time-series forecasting.

## Features

- **Prophet Model**: Facebook's robust time-series forecasting
- **REST API**: Simple HTTP endpoints
- **CORS Enabled**: Works with any frontend
- **Railway Ready**: Optimized for Railway deployment
- **Auto Documentation**: FastAPI Swagger docs at `/docs`

## Quick Start

### Install Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
```

### Run Server

```bash
uvicorn main:app --reload --port 8000
```

Server runs at: http://localhost:8000

## API Endpoints

### `GET /`
Health check and API info

**Response:**
```json
{
  "message": "Time Series Forecasting API",
  "status": "active",
  "model": "Prophet"
}
```

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy"
}
```

### `POST /api/predict`
Generate time-series predictions

**Request:**
```json
{
  "data": [
    {"time": 0, "measured_value": 98.5},
    {"time": 1, "measured_value": 101.2},
    {"time": 2, "measured_value": 99.8}
  ],
  "numPredictions": 10
}
```

**Response:**
```json
{
  "predictions": [
    {"time": 3, "predicted_value": 100.5},
    {"time": 4, "predicted_value": 101.2}
  ],
  "method": "Facebook Prophet (Additive Model)"
}
```

## Prophet Configuration

The model is configured with:
- **Changepoint Prior Scale**: 0.05 (moderate flexibility)
- **Seasonality Mode**: Additive
- **Custom Seasonality**: Enabled for datasets with 10+ points
- **Interval Width**: 95% confidence

## Testing

### Using curl

```bash
curl -X POST http://localhost:8000/api/predict \
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

### Using Python

```python
import requests

response = requests.post(
    "http://localhost:8000/api/predict",
    json={
        "data": [
            {"time": 0, "measured_value": 100},
            {"time": 1, "measured_value": 101},
        ],
        "numPredictions": 5
    }
)
print(response.json())
```

## Interactive API Docs

Visit http://localhost:8000/docs for interactive Swagger documentation.

## Deployment

See `RAILWAY_DEPLOYMENT.md` for Railway deployment instructions.

## Requirements

- Python 3.11+
- FastAPI 0.109+
- Prophet 1.1.5
- Pandas 2.2+
- Uvicorn 0.27+

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 8000 |

## License

Open Source
