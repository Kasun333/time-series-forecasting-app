// Data types for the time-series forecasting application

export interface DataPoint {
  time: number;
  measured_value: number;
}

export interface PredictedPoint {
  time: number;
  predicted_value: number;
}

export interface ChartDataPoint {
  time: number;
  measured?: number;
  predicted?: number;
  true?: number;
  type: 'actual' | 'predicted';
}

export interface ClickedPointData {
  time: number;
  measuredValue?: number;
  predictedValue?: number;
  trueValue: number;
  deviation?: number;
  isPrediction: boolean;
}

export interface PredictionRequest {
  data: DataPoint[];
  numPredictions: number;
}

export interface PredictionResponse {
  predictions: PredictedPoint[];
  method: string;
}
