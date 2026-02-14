'use client';

import { useState } from 'react';
import CSVUploader from '@/components/CSVUploader';
import TrueValueInput from '@/components/TrueValueInput';
import ChartViewer from '@/components/ChartViewer';
import DataPointModal from '@/components/DataPointModal';
import { DataPoint, PredictedPoint, ChartDataPoint, ClickedPointData, AccuracyMetrics, TestResult } from '@/types';
import { LineChart, Loader2, BarChart3, Target, TrendingUp, Percent } from 'lucide-react';

export default function Home() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [predictions, setPredictions] = useState<PredictedPoint[]>([]);
  const [trueValue, setTrueValue] = useState<number | null>(null);
  const [numPredictions, setNumPredictions] = useState<number>(10);
  const [selectedPoint, setSelectedPoint] = useState<ClickedPointData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [predictionMethod, setPredictionMethod] = useState<string>('');
  const [accuracy, setAccuracy] = useState<AccuracyMetrics | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const handleDataLoaded = async (newData: DataPoint[]) => {
    setData(newData);
    setPredictions([]);
    setError('');
    setAccuracy(null);
    setTestResults([]);
    
    // Automatically generate predictions when data is loaded
    await generatePredictions(newData, numPredictions);
  };

  const generatePredictions = async (dataToPredict: DataPoint[], numPreds: number) => {
    if (dataToPredict.length < 2) {
      setError('Need at least 2 data points to generate predictions');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: dataToPredict,
          numPredictions: numPreds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate predictions');
      }

      const result = await response.json();
      setPredictions(result.predictions);
      setPredictionMethod(result.method || '');
      setAccuracy(result.accuracy || null);
      setTestResults(result.test_results || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate predictions';
      setError(errorMessage);
      setPredictions([]);
      setAccuracy(null);
      setTestResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNumPredictionsChange = (num: number) => {
    setNumPredictions(num);
    if (data.length >= 2) {
      generatePredictions(data, num);
    }
  };

  // Combine actual, test, and predicted data for the chart
  const chartData: ChartDataPoint[] = [
    ...data.map((point) => ({
      time: point.time,
      measured: point.measured_value,
      true: trueValue ?? undefined,
      type: 'actual' as const,
    })),
    ...testResults.map((tr) => ({
      time: tr.time,
      testPredicted: tr.predicted_value,
      testActual: tr.actual_value,
      true: trueValue ?? undefined,
      type: 'test' as const,
    })),
    ...predictions.map((point) => ({
      time: point.time,
      predicted: point.predicted_value,
      true: trueValue ?? undefined,
      type: 'predicted' as const,
    })),
  ].sort((a, b) => a.time - b.time);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <LineChart className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Time Series Forecasting
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Upload CSV data, configure predictions, and analyze deviations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload and Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Data</h2>
              <CSVUploader onDataLoaded={handleDataLoaded} />
            </div>

            <TrueValueInput
              value={trueValue}
              onChange={setTrueValue}
              numPredictions={numPredictions}
              onNumPredictionsChange={handleNumPredictionsChange}
            />

            {/* Stats */}
            {data.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data Points</span>
                    <span className="text-sm font-semibold text-gray-900">{data.length}</span>
                  </div>
                  {accuracy && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Training Set (80%)</span>
                        <span className="text-sm font-semibold text-blue-600">{accuracy.train_size} points</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Test Set (20%)</span>
                        <span className="text-sm font-semibold text-orange-600">{accuracy.test_size} points</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Future Predictions</span>
                    <span className="text-sm font-semibold text-gray-900">{predictions.length}</span>
                  </div>
                  {predictionMethod && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="text-xs text-gray-500">Method:</span>
                      <p className="text-xs font-medium text-blue-600 mt-1">{predictionMethod}</p>
                    </div>
                  )}
                  {data.length > 0 && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Time Range</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {data[0].time.toFixed(2)} - {data[data.length - 1].time.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Value Range</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {Math.min(...data.map(d => d.measured_value)).toFixed(2)} -{' '}
                          {Math.max(...data.map(d => d.measured_value)).toFixed(2)}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Model Accuracy Metrics */}
            {accuracy && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 text-green-600 mr-2" />
                  Model Accuracy
                </h3>
                <div className="space-y-3">
                  {/* R² Score - Main Metric */}
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-blue-800 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        R² Score
                      </span>
                      <span className={`text-lg font-bold ${
                        accuracy.r_squared >= 0.9 ? 'text-green-600' :
                        accuracy.r_squared >= 0.7 ? 'text-yellow-600' :
                        accuracy.r_squared >= 0.5 ? 'text-orange-600' :
                        'text-red-600'
                      }`}>
                        {(accuracy.r_squared * 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          accuracy.r_squared >= 0.9 ? 'bg-green-500' :
                          accuracy.r_squared >= 0.7 ? 'bg-yellow-500' :
                          accuracy.r_squared >= 0.5 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${Math.max(0, Math.min(100, accuracy.r_squared * 100))}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      {accuracy.r_squared >= 0.9 ? 'Excellent fit' :
                       accuracy.r_squared >= 0.7 ? 'Good fit' :
                       accuracy.r_squared >= 0.5 ? 'Moderate fit' :
                       'Poor fit'}
                    </p>
                  </div>

                  {/* Other Metrics */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <span className="text-xs text-gray-500 block">MAE</span>
                      <span className="text-sm font-bold text-gray-900">{accuracy.mae.toFixed(4)}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <span className="text-xs text-gray-500 block">RMSE</span>
                      <span className="text-sm font-bold text-gray-900">{accuracy.rmse.toFixed(4)}</span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <span className="text-xs text-gray-500 block flex items-center justify-center">
                        MAPE
                      </span>
                      <span className="text-sm font-bold text-gray-900">{accuracy.mape.toFixed(2)}%</span>
                    </div>
                  </div>

                  {/* Metric Descriptions */}
                  <div className="pt-2 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                    <p><strong>MAE:</strong> Mean Absolute Error (lower is better)</p>
                    <p><strong>RMSE:</strong> Root Mean Square Error (lower is better)</p>
                    <p><strong>MAPE:</strong> Mean Absolute % Error (lower is better)</p>
                    <p><strong>R²:</strong> Coefficient of Determination (closer to 100% is better)</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Chart */}
          <div className="lg:col-span-2">
            {isLoading && (
              <div className="flex items-center justify-center p-8 bg-white rounded-lg border border-gray-200 mb-4">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin mr-2" />
                <span className="text-gray-700">Generating predictions...</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <ChartViewer
              data={chartData}
              trueValue={trueValue}
              onPointClick={setSelectedPoint}
            />

            {/* Instructions */}
            {data.length === 0 && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                  <li>Upload a CSV file with "time" and "measured_value" columns</li>
                  <li>Enter the true constant value for reference</li>
                  <li>Choose how many future points to predict</li>
                  <li>Click on data points to see detailed information</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Data Point Modal */}
      <DataPointModal data={selectedPoint} onClose={() => setSelectedPoint(null)} />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Built with Next.js 14 (App Router) • Ready for Vercel deployment
          </p>
        </div>
      </footer>
    </main>
  );
}
