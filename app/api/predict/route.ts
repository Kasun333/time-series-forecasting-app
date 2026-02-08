import { NextRequest, NextResponse } from 'next/server';
import { PredictionRequest, PredictionResponse } from '@/types';

/**
 * Proxy endpoint for FastAPI backend with Prophet model
 * 
 * This endpoint forwards prediction requests to the Python FastAPI backend
 * which uses Facebook Prophet for time-series forecasting.
 */

const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body: PredictionRequest = await request.json();
    
    if (!body.data || !Array.isArray(body.data) || body.data.length < 2) {
      return NextResponse.json(
        { error: 'Invalid data: need at least 2 data points' },
        { status: 400 }
      );
    }

    const numPredictions = body.numPredictions || 10;
    
    if (numPredictions < 1 || numPredictions > 100) {
      return NextResponse.json(
        { error: 'Number of predictions must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Forward request to FastAPI backend
    console.log(`Calling FastAPI at: ${FASTAPI_URL}/api/predict`);
    
    const response = await fetch(`${FASTAPI_URL}/api/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: body.data,
        numPredictions: numPredictions,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('FastAPI error:', errorData);
      return NextResponse.json(
        { error: errorData.detail || 'Failed to generate predictions' },
        { status: response.status }
      );
    }

    const result: PredictionResponse = await response.json();
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Prediction error:', error);
    
    // Check if FastAPI is unreachable
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return NextResponse.json(
        { 
          error: 'Unable to connect to prediction service. Please ensure FastAPI backend is running.',
          detail: 'Check FASTAPI_URL environment variable or start the backend server.'
        },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
