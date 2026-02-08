'use client';

import React, { useRef, useState } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { DataPoint } from '@/types';

interface CSVUploaderProps {
  onDataLoaded: (data: DataPoint[]) => void;
}

export default function CSVUploader({ onDataLoaded }: CSVUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const validateAndParseCSV = (file: File) => {
    setError('');
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as any[];
          
          // Validate CSV structure
          if (data.length === 0) {
            throw new Error('CSV file is empty');
          }

          const firstRow = data[0];
          const hasTime = 'time' in firstRow;
          const hasMeasuredValue = 'measured_value' in firstRow;

          if (!hasTime || !hasMeasuredValue) {
            throw new Error('CSV must contain "time" and "measured_value" columns');
          }

          // Parse and validate data
          const parsedData: DataPoint[] = data
            .map((row, index) => {
              const time = parseFloat(row.time);
              const measured_value = parseFloat(row.measured_value);

              if (isNaN(time) || isNaN(measured_value)) {
                throw new Error(`Invalid data at row ${index + 2}`);
              }

              return { time, measured_value };
            })
            .sort((a, b) => a.time - b.time); // Sort by time

          if (parsedData.length < 2) {
            throw new Error('Need at least 2 data points for prediction');
          }

          onDataLoaded(parsedData);
          setError('');
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to parse CSV';
          setError(errorMessage);
          setFileName('');
        }
      },
      error: (err) => {
        setError(`Failed to read file: ${err.message}`);
        setFileName('');
      },
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndParseCSV(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'text/csv') {
      validateAndParseCSV(file);
    } else {
      setError('Please drop a valid CSV file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {fileName ? (
            <>
              <FileText className="w-12 h-12 text-green-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500 mt-1">File loaded successfully</p>
              </div>
            </>
          ) : (
            <>
              <Upload className="w-12 h-12 text-gray-400" />
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  Drop your CSV file here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  CSV must contain "time" and "measured_value" columns
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
