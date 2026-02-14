from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from prophet import Prophet
import pandas as pd
import numpy as np
from typing import List, Optional
import logging
import math

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

class TestResult(BaseModel):
    time: float
    actual_value: float
    predicted_value: float
    error: float

class AccuracyMetrics(BaseModel):
    mae: float  # Mean Absolute Error
    rmse: float  # Root Mean Squared Error
    mape: float  # Mean Absolute Percentage Error
    r_squared: float  # R² Score
    train_size: int
    test_size: int

class PredictionResponse(BaseModel):
    predictions: List[PredictedPoint]
    method: str
    accuracy: Optional[AccuracyMetrics] = None
    test_results: Optional[List[TestResult]] = None

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

def calculate_metrics(actual: list, predicted: list) -> AccuracyMetrics:
    """Calculate accuracy metrics for model evaluation."""
    actual = np.array(actual)
    predicted = np.array(predicted)
    
    # Mean Absolute Error
    mae = float(np.mean(np.abs(actual - predicted)))
    
    # Root Mean Squared Error
    rmse = float(np.sqrt(np.mean((actual - predicted) ** 2)))
    
    # Mean Absolute Percentage Error (avoid division by zero)
    non_zero_mask = actual != 0
    if np.any(non_zero_mask):
        mape = float(np.mean(np.abs((actual[non_zero_mask] - predicted[non_zero_mask]) / actual[non_zero_mask])) * 100)
    else:
        mape = 0.0
    
    # R² Score
    ss_res = np.sum((actual - predicted) ** 2)
    ss_tot = np.sum((actual - np.mean(actual)) ** 2)
    r_squared = float(1 - (ss_res / ss_tot)) if ss_tot != 0 else 0.0
    
    return AccuracyMetrics(
        mae=round(mae, 4),
        rmse=round(rmse, 4),
        mape=round(mape, 4),
        r_squared=round(r_squared, 4),
        train_size=0,  # Will be set by caller
        test_size=0    # Will be set by caller
    )

def time_to_timestamp(t: float) -> pd.Timestamp:
    """Convert time value to pandas Timestamp."""
    if t > 1000000000:
        return pd.Timestamp.fromtimestamp(t)
    else:
        return pd.Timestamp('2020-01-01') + pd.Timedelta(days=t)

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
        
        # --- 80/20 Train-Test Split ---
        total_points = len(request.data)
        train_size = max(2, int(total_points * 0.8))  # At least 2 for training
        test_size = total_points - train_size
        
        train_data = request.data[:train_size]
        test_data = request.data[train_size:]
        
        logger.info(f"Split data: {train_size} train, {test_size} test points")
        
        # Prepare training data for Prophet
        train_df = pd.DataFrame([
            {'ds': time_to_timestamp(point.time), 'y': point.measured_value}
            for point in train_data
        ])
        
        logger.info(f"Prepared training DataFrame with {len(train_df)} rows")
        
        # Initialize and fit Prophet model on TRAINING data only
        model = Prophet(
            changepoint_prior_scale=0.05,
            seasonality_mode='additive',
            daily_seasonality=False,
            weekly_seasonality=False,
            yearly_seasonality=False,
            interval_width=0.95
        )
        
        if len(train_df) >= 10:
            model.add_seasonality(name='custom', period=len(train_df)/2, fourier_order=3)
        
        logger.info("Fitting Prophet model on training data...")
        model.fit(train_df)
        logger.info("Model fitted successfully")
        
        # --- Evaluate on Test Data (20%) ---
        accuracy = None
        test_results = None
        
        if test_size > 0:
            test_df = pd.DataFrame([
                {'ds': time_to_timestamp(point.time)}
                for point in test_data
            ])
            
            test_forecast = model.predict(test_df)
            
            actual_values = [point.measured_value for point in test_data]
            predicted_values = [float(test_forecast.iloc[i]['yhat']) for i in range(len(test_forecast))]
            
            # Calculate accuracy metrics
            accuracy = calculate_metrics(actual_values, predicted_values)
            accuracy.train_size = train_size
            accuracy.test_size = test_size
            
            # Build test results
            test_results = [
                TestResult(
                    time=test_data[i].time,
                    actual_value=actual_values[i],
                    predicted_value=predicted_values[i],
                    error=round(actual_values[i] - predicted_values[i], 4)
                )
                for i in range(test_size)
            ]
            
            logger.info(f"Test metrics - MAE: {accuracy.mae}, RMSE: {accuracy.rmse}, MAPE: {accuracy.mape}%, R²: {accuracy.r_squared}")
        
        # --- Generate Future Predictions ---
        time_values = [point.time for point in request.data]
        time_step = (time_values[-1] - time_values[-2]) if len(time_values) >= 2 else 1
        
        last_time = time_values[-1]
        future_times = [last_time + time_step * (i + 1) for i in range(request.numPredictions)]
        
        future_df = pd.DataFrame([
            {'ds': time_to_timestamp(t)}
            for t in future_times
        ])
        
        logger.info(f"Generating {request.numPredictions} future predictions...")
        forecast = model.predict(future_df)
        
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
            method="Facebook Prophet (Additive Model)",
            accuracy=accuracy,
            test_results=test_results
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
