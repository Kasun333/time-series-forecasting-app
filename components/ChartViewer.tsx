'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Dot,
} from 'recharts';
import { ChartDataPoint, ClickedPointData } from '@/types';

interface ChartViewerProps {
  data: ChartDataPoint[];
  trueValue: number | null;
  onPointClick: (data: ClickedPointData | null) => void;
}

export default function ChartViewer({ data, trueValue, onPointClick }: ChartViewerProps) {
  const handleDotClick = (data: any, event: any) => {
    if (data && data.payload) {
      const point = data.payload;
      const clickedData: ClickedPointData = {
        time: point.time,
        measuredValue: point.measured,
        predictedValue: point.predicted,
        trueValue: trueValue ?? 0,
        deviation: point.measured !== undefined 
          ? point.measured - (trueValue ?? 0)
          : point.predicted !== undefined
          ? point.predicted - (trueValue ?? 0)
          : undefined,
        isPrediction: point.type === 'predicted',
      };
      onPointClick(clickedData);
    }
  };

  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    
    // Only render dots for the actual data points
    if (dataKey === 'measured' && payload.measured !== undefined) {
      return (
        <Dot
          cx={cx}
          cy={cy}
          r={5}
          fill="#3b82f6"
          stroke="#1e40af"
          strokeWidth={2}
          onClick={(e) => handleDotClick(props, e)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    
    if (dataKey === 'predicted' && payload.predicted !== undefined) {
      return (
        <Dot
          cx={cx}
          cy={cy}
          r={5}
          fill="#10b981"
          stroke="#059669"
          strokeWidth={2}
          onClick={(e) => handleDotClick(props, e)}
          style={{ cursor: 'pointer' }}
        />
      );
    }
    
    return null;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Time: {data.time.toFixed(2)}
          </p>
          {data.measured !== undefined && (
            <p className="text-sm text-blue-600">
              Measured: {data.measured.toFixed(2)}
            </p>
          )}
          {data.predicted !== undefined && (
            <p className="text-sm text-green-600">
              Predicted: {data.predicted.toFixed(2)}
            </p>
          )}
          {trueValue !== null && (
            <>
              <p className="text-sm text-purple-600">
                True: {trueValue.toFixed(2)}
              </p>
              {data.measured !== undefined && (
                <p className="text-sm text-red-600 mt-1 pt-1 border-t border-gray-200">
                  Deviation (Measured): {(data.measured - trueValue).toFixed(2)}
                </p>
              )}
              {data.predicted !== undefined && (
                <p className="text-sm text-orange-600 mt-1 pt-1 border-t border-gray-200">
                  Deviation (Predicted): {(data.predicted - trueValue).toFixed(2)}
                </p>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-lg">No data to display. Please upload a CSV file.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Series Forecast</h3>
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onClick={() => onPointClick(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <YAxis
              label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
              tick={{ fill: '#6b7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            
            {/* True value reference line */}
            {trueValue !== null && (
              <ReferenceLine
                y={trueValue}
                stroke="#9333ea"
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{
                  value: 'True Value',
                  position: 'right',
                  fill: '#9333ea',
                  fontSize: 12,
                }}
              />
            )}
            
            {/* Measured values line */}
            <Line
              type="monotone"
              dataKey="measured"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Measured"
              dot={<CustomDot />}
              connectNulls={false}
              isAnimationActive={true}
            />
            
            {/* Predicted values line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Predicted"
              dot={<CustomDot />}
              connectNulls={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-600">
        <p>💡 <strong>Tip:</strong> Click on any data point to see detailed information</p>
      </div>
    </div>
  );
}
