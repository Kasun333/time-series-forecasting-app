'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

interface TrueValueInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  numPredictions: number;
  onNumPredictionsChange: (value: number) => void;
}

export default function TrueValueInput({
  value,
  onChange,
  numPredictions,
  onNumPredictionsChange,
}: TrueValueInputProps) {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onChange(null);
    } else {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handlePredictionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 100) {
      onNumPredictionsChange(val);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
        </div>

        <div className="space-y-4">
          {/* True Value Input */}
          <div>
            <label
              htmlFor="true-value"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              True Function Value (Constant)
            </label>
            <input
              id="true-value"
              type="number"
              step="any"
              value={value ?? ''}
              onChange={handleValueChange}
              placeholder="Enter true value (e.g., 100)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              This constant will be shown as a horizontal line on the chart
            </p>
          </div>

          {/* Number of Predictions */}
          <div>
            <label
              htmlFor="num-predictions"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of Future Points to Predict
            </label>
            <input
              id="num-predictions"
              type="number"
              min="1"
              max="100"
              value={numPredictions}
              onChange={handlePredictionsChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <p className="text-xs text-gray-500 mt-1">
              Choose between 1 and 100 future points (default: 10)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
