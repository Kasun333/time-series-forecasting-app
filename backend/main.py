from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prophet import Prophet
import pandas as pd
from typing import List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Time Series Forecasting API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your Next.js domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class DataPoint(BaseModel):
    time: float
    measured_value: float

class PredictionRequest(BaseModel):
    data: List[DataPoint]
    numPredictions: int

class PredictedPoint(BaseModel):
    time: float
    predicted_value: float

class PredictionResponse(BaseModel):
    predictions: List[PredictedPoint]
    method: str

@app.get("/")
async def root():
    return {
        "message": "Time Series Forecasting API",
        "status": "active",
        "model": "Prophet"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        logger.info(f"Received prediction request for {len(request.data)} data points")
        
        # Validate input
        if len(request.data) < 2:
            raise HTTPException(
                status_code=400, 
                detail="Need at least 2 data points for prediction"
            )
        
        if request.numPredictions < 1 or request.numPredictions > 100:
            raise HTTPException(
                status_code=400,
                detail="Number of predictions must be between 1 and 100"
            )
        
        # Prepare data for Prophet
        # Prophet requires columns named 'ds' (datestamp) and 'y' (value)
        df = pd.DataFrame([
            {
                'ds': pd.Timestamp.fromtimestamp(point.time) if point.time > 1000000000 
                     else pd.Timestamp('2020-01-01') + pd.Timedelta(days=point.time),
                'y': point.measured_value
            }
            for point in request.data
        ])
        
        logger.info(f"Prepared DataFrame with {len(df)} rows")
        
        # Initialize and fit Prophet model
        # Disable daily/weekly/yearly seasonality for generic time series
        model = Prophet(
            changepoint_prior_scale=0.05,  # Flexibility of trend changes
            seasonality_mode='additive',
            daily_seasonality=False,
            weekly_seasonality=False,
            yearly_seasonality=False,
            interval_width=0.95
        )
        
        # Add custom seasonality if enough data points
        if len(df) >= 10:
            model.add_seasonality(name='custom', period=len(df)/2, fourier_order=3)
        
        logger.info("Fitting Prophet model...")
        model.fit(df)
        logger.info("Model fitted successfully")
        
        # Calculate time step from data
        time_values = [point.time for point in request.data]
        time_step = (time_values[-1] - time_values[-2]) if len(time_values) >= 2 else 1
        
        # Create future dataframe for predictions
        last_time = time_values[-1]
        future_times = [last_time + time_step * (i + 1) for i in range(request.numPredictions)]
        
        future_df = pd.DataFrame([
            {
                'ds': pd.Timestamp.fromtimestamp(t) if t > 1000000000 
                     else pd.Timestamp('2020-01-01') + pd.Timedelta(days=t)
            }
            for t in future_times
        ])
        
        logger.info(f"Generating {request.numPredictions} predictions...")
        forecast = model.predict(future_df)
        
        # Extract predictions
        predictions = [
            PredictedPoint(
                time=future_times[i],
                predicted_value=float(forecast.iloc[i]['yhat'])
            )
            for i in range(len(forecast))
        ]
        
        logger.info(f"Successfully generated {len(predictions)} predictions")
        
        return PredictionResponse(
            predictions=predictions,
            method="Facebook Prophet (Additive Model)"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
