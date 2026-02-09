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
  testPredicted?: number;
  testActual?: number;
  true?: number;
  type: 'actual' | 'predicted' | 'test';
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

export interface TestResult {
  time: number;
  actual_value: number;
  predicted_value: number;
  error: number;
}

export interface AccuracyMetrics {
  mae: number;
  rmse: number;
  mape: number;
  r_squared: number;
  train_size: number;
  test_size: number;
}

export interface PredictionResponse {
  predictions: PredictedPoint[];
  method: string;
  accuracy?: AccuracyMetrics;
  test_results?: TestResult[];
}
