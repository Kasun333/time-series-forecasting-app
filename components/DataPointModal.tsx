'use client';

import React from 'react';
import { X, TrendingUp, Target, Activity } from 'lucide-react';
import { ClickedPointData } from '@/types';

interface DataPointModalProps {
  data: ClickedPointData | null;
  onClose: () => void;
}

export default function DataPointModal({ data, onClose }: DataPointModalProps) {
  if (!data) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-md w-full pointer-events-auto transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Activity className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {data.isPrediction ? 'Predicted Point' : 'Measured Point'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Time Coordinate</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{data.time.toFixed(2)}</p>
            </div>

            {/* Measured Value */}
            {data.measuredValue !== undefined && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Measured Value</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {data.measuredValue.toFixed(2)}
                </p>
              </div>
            )}

            {/* Predicted Value */}
            {data.predictedValue !== undefined && (
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Predicted Value</span>
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {data.predictedValue.toFixed(2)}
                </p>
              </div>
            )}

            {/* True Value */}
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">True Value (Constant)</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">
                {data.trueValue.toFixed(2)}
              </p>
            </div>

            {/* Deviation */}
            {data.deviation !== undefined && (
              <div
                className={`rounded-lg p-4 ${
                  Math.abs(data.deviation) < 1
                    ? 'bg-green-50'
                    : Math.abs(data.deviation) < 5
                    ? 'bg-yellow-50'
                    : 'bg-red-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <Activity
                    className={`w-5 h-5 ${
                      Math.abs(data.deviation) < 1
                        ? 'text-green-600'
                        : Math.abs(data.deviation) < 5
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      Math.abs(data.deviation) < 1
                        ? 'text-green-600'
                        : Math.abs(data.deviation) < 5
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    Deviation ({data.isPrediction ? 'Predicted' : 'Measured'} - True)
                  </span>
                </div>
                <p
                  className={`text-2xl font-bold ${
                    Math.abs(data.deviation) < 1
                      ? 'text-green-900'
                      : Math.abs(data.deviation) < 5
                      ? 'text-yellow-900'
                      : 'text-red-900'
                  }`}
                >
                  {data.deviation > 0 ? '+' : ''}
                  {data.deviation.toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  {Math.abs(data.deviation) < 1
                    ? 'Low deviation - close to true value'
                    : Math.abs(data.deviation) < 5
                    ? 'Moderate deviation'
                    : 'High deviation - far from true value'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
