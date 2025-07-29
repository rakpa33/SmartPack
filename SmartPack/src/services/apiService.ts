// src/services/apiService.ts

import type { TripFormData } from '../types';

// Define types for API responses
export interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  checked: boolean;
  aiGenerated: boolean;
}

export interface GenerateResponse {
  checklist: ChecklistItem[];
  suggestedItems: string[];
  aiGenerated?: boolean;
  fallbackReason?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  conditions: string;
  precipitation: number;
}

// API URL based on environment
const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://your-production-api-url.com'
  : 'http://localhost:3000';

/**
 * Generate a packing list based on trip and weather data
 */
export async function generatePackingList(
  tripData: TripFormData, 
  weatherData: WeatherData[]
): Promise<GenerateResponse> {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        trip: tripData,
        weather: weatherData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate packing list');
    }

    const data: GenerateResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

/**
 * Generate AI suggestions based on custom prompt
 */
export async function generateAISuggestions(
  customPrompt: string,
  tripData: TripFormData, 
  weatherData: WeatherData[]
): Promise<{ suggestedItems: string[]; aiGenerated?: boolean; fallbackReason?: string }> {
  try {
    const response = await fetch(`${API_URL}/suggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customPrompt,
        trip: tripData,
        weather: weatherData,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate AI suggestions');
    }

    const data: { suggestedItems: string[]; aiGenerated?: boolean; fallbackReason?: string } = await response.json();
    return data;
  } catch (error) {
    console.error('AI suggestions API error:', error);
    throw error;
  }
}

/**
 * Check if the API is available (health check)
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
}
