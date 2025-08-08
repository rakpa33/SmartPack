import React, { useState } from 'react';
import { TripDetails } from './TripDetails';
import { useTripForm } from '../hooks/useTripForm';
import { generatePackingList, type WeatherData } from '../services/apiService';
import type { TripFormData } from '../types/tripForm';
import { SparklesIcon } from '@heroicons/react/24/solid';

interface TripDetailsWithGenerationProps {
  tripName?: string;
  startDate?: string;
  endDate?: string;
  destinations?: string[];
  travelModes?: string[];
  preferences?: string[];
  weather?: {
    weathercode?: number;
    summary?: string;
    temperatureMin?: number;
    temperatureMax?: number;
    averageTemp?: number;
  };
  weatherTypes?: Array<{ icon: string; condition: string }>;
  isFirstTimeOrNewTrip?: boolean;
}

export const TripDetailsWithGeneration: React.FC<TripDetailsWithGenerationProps> = (props) => {
  const { state, dispatch } = useTripForm();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Check if we have enough trip data to generate a packing list
  const canGenerate = !!(
    state.tripName?.trim() &&
    state.destinations?.length > 0 &&
    state.destinations.some(d => d?.trim()) &&
    state.travelModes?.length > 0 &&
    state.startDate &&
    state.endDate
  );

  // Debug logging to track button visibility
  React.useEffect(() => {
    console.log('🔍 Generate Button Debug:', {
      canGenerate,
      tripName: state.tripName,
      hasDestinations: state.destinations?.length > 0,
      validDestinations: state.destinations?.some(d => d?.trim()),
      destinations: state.destinations,
      hasTravelModes: state.travelModes?.length > 0,
      travelModes: state.travelModes,
      startDate: state.startDate,
      endDate: state.endDate,
      fullState: state
    });
  }, [canGenerate, state]);

  // Check if we already have a generated packing list
  const hasGeneratedList = !!state.generatedPackingList;

  const handleGeneratePackingList = async () => {
    console.log('🚀 Generate button clicked!', { canGenerate, isGenerating });
    if (!canGenerate || isGenerating) return;

    setIsGenerating(true);
    setGenerationError(null);

    try {
      console.log('📡 Starting API call to generate packing list...');
      console.log('Current state weather:', state.weather);
      
      // Convert trip state to API format
      const tripData: TripFormData = {
        name: state.tripName,
        startDate: state.startDate,
        endDate: state.endDate,
        destinations: state.destinations.filter(d => d?.trim()),
        travelModes: state.travelModes,
        tripDetails: `Travel preferences: ${state.preferences?.join(', ') || 'general travel'}. Weather: ${state.weather?.summary || 'unknown conditions'}.`
      };

      // Convert weather data to API format
      const weatherData: WeatherData[] = state.weather ? [{
        location: state.destinations[0] || 'Unknown',
        temperature: state.weather.averageTemp || state.weather.temperatureMax || 20,
        conditions: state.weather.summary || 'Clear',
        precipitation: 0
      }] : [];
      
      console.log('Sending to API:', { tripData, weatherData });

      // Call the API to generate the packing list
      const result = await generatePackingList(tripData, weatherData);

      // Store the result in state
      dispatch({
        type: 'SET_GENERATED_PACKING_LIST',
        value: result
      });

      console.log('✅ Packing list generated successfully:', result);
    } catch (error) {
      console.error('❌ Failed to generate packing list:', error);
      setGenerationError(error instanceof Error ? error.message : 'Failed to generate packing list');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Original TripDetails component */}
      <TripDetails {...props} />
      
      {/* Generation Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              AI Packing List
            </h3>
            {hasGeneratedList && (
              <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full">
                ✓ Generated
              </span>
            )}
          </div>
          
          {!canGenerate && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Complete your trip details above to generate a personalized packing list.
            </p>
          )}
          
          {canGenerate && (
            <button
              onClick={handleGeneratePackingList}
              disabled={isGenerating}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-200 ${
                isGenerating
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : hasGeneratedList
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
              aria-label={hasGeneratedList ? 'Regenerate Smart Packing List' : 'Generate Smart Packing List'}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                  <span>Generating with AI...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  <span>{hasGeneratedList ? 'Regenerate Smart Packing List' : 'Generate Smart Packing List'}</span>
                </>
              )}
            </button>
          )}
          
          {generationError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                <strong>Error:</strong> {generationError}
              </p>
              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                Please ensure Ollama is running and try again.
              </p>
            </div>
          )}
          
          {hasGeneratedList && (
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <p>
                <strong>Success!</strong> Your AI-powered packing list has been generated based on your trip details and weather forecast. 
                Check the <strong>Packing Checklist</strong> and <strong>AI Suggestions</strong> panels to see personalized recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};