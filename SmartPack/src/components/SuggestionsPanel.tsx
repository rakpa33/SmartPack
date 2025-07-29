import React, { useState, useEffect } from 'react';
import { useTripForm } from '../hooks/useTripForm';
import { usePackingList } from '../hooks/usePackingList';
import { generateAISuggestions, type WeatherData } from '../services/apiService';
import type { TripFormData } from '../types';
import { ArrowPathIcon, PlusIcon, XMarkIcon, CpuChipIcon } from '@heroicons/react/24/solid';

interface SuggestionItem {
  id: string;
  text: string;
  category: string;
}

export const SuggestionsPanel: React.FC = () => {
  const { state } = useTripForm();
  const { addItem } = usePackingList();
  const [customPrompt, setCustomPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial suggestions from the trip form state
  useEffect(() => {
    if (state.generatedPackingList?.suggestedItems) {
      const initialSuggestions: SuggestionItem[] = state.generatedPackingList.suggestedItems.map((item: string, index: number) => ({
        id: `suggestion-${index}`,
        text: item,
        category: 'general' // Default category for string suggestions
      }));
      setSuggestions(initialSuggestions);
    }
  }, [state.generatedPackingList]);

  const handleRefinementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;

    // Convert current state to TripFormData format
    const tripData: TripFormData = {
      name: state.tripName,
      startDate: state.startDate,
      endDate: state.endDate,
      destinations: state.destinations,
      travelModes: state.travelModes,
      tripDetails: `Travel preferences: ${state.preferences.join(', ') || 'general travel'}. Weather: ${state.weather?.summary || 'unknown conditions'}.`
    };

    // Convert current weather to WeatherData format
    const weatherData: WeatherData[] = state.weather ? [{
      location: state.destinations[0] || 'Unknown',
      temperature: state.weather.temperature || 20,
      conditions: state.weather.summary || 'Clear',
      precipitation: 0
    }] : [];

    if (!tripData.name || tripData.destinations.length === 0) {
      setError('Please complete your trip details first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use the dedicated AI suggestions endpoint
      const response = await generateAISuggestions(customPrompt, tripData, weatherData);

      // Extract new suggestions from the response
      if (response.suggestedItems) {
        const newSuggestions: SuggestionItem[] = response.suggestedItems.map((item: string, index: number) => ({
          id: `refined-${Date.now()}-${index}`,
          text: item,
          category: 'general'
        }));

        // Add new suggestions to existing ones
        setSuggestions(prev => [...prev, ...newSuggestions]);
      }

      // Clear the prompt after successful submission
      setCustomPrompt('');
    } catch (err) {
      setError('Failed to get AI suggestions. Please try again.');
      console.error('Error generating refined suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestion = (suggestion: SuggestionItem) => {
    // Add the suggestion to the main packing list
    addItem({
      label: suggestion.text,
      checked: false,
      category: suggestion.category,
      aiGenerated: true
    });

    // Remove the suggestion from the suggestions list
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleRemoveSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const handleRefreshSuggestions = async () => {
    if (!state.tripName || state.destinations.length === 0) {
      setError('Please complete your trip details first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const tripData: TripFormData = {
        name: state.tripName,
        startDate: state.startDate,
        endDate: state.endDate,
        destinations: state.destinations,
        travelModes: state.travelModes,
        tripDetails: `Travel preferences: ${state.preferences.join(', ') || 'general travel'}. Weather: ${state.weather?.summary || 'unknown conditions'}.`
      };

      const weatherData: WeatherData[] = state.weather ? [{
        location: state.destinations[0] || 'Unknown',
        temperature: state.weather.temperature || 20,
        conditions: state.weather.summary || 'Clear',
        precipitation: 0
      }] : [];

      // Use AI suggestions endpoint with a general refresh prompt
      const refreshPrompt = 'Suggest additional useful packing items based on the trip details and current checklist';
      const response = await generateAISuggestions(refreshPrompt, tripData, weatherData);

      if (response.suggestedItems) {
        const newSuggestions: SuggestionItem[] = response.suggestedItems.map((item: string, index: number) => ({
          id: `refresh-${Date.now()}-${index}`,
          text: item,
          category: 'general'
        }));

        // Replace all suggestions with fresh ones
        setSuggestions(newSuggestions);
      }
    } catch (err) {
      setError('Failed to refresh suggestions. Please try again.');
      console.error('Error refreshing suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const hasTrip = state.step >= 2 && state.tripName && state.destinations.length > 0;

  return (
    <div className="h-full">
      <h2 className="font-bold text-xl mb-4" role="heading" aria-level={2}>
        AI Suggestions
      </h2>

      {!hasTrip ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Complete your trip details to get AI-powered packing suggestions.
          </p>
          <div className="flex justify-center mb-4">
            <CpuChipIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            AI will analyze your destinations, weather, and travel modes to suggest items you might need.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Refinement Form */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Refine Suggestions
            </h3>
            <form onSubmit={handleRefinementSubmit} className="space-y-3">
              <div>
                <label
                  htmlFor="custom-prompt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  What specific items or activities should we consider?
                </label>
                <textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., business meetings, hiking, photography, cold-weather gear..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 resize-none"
                  rows={3}
                  disabled={isLoading}
                />
              </div>
              <button
                type="submit"
                disabled={!customPrompt.trim() || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? 'Getting Suggestions...' : 'Get More Suggestions'}
              </button>
            </form>
            {error && (
              <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}
          </div>

          {/* Suggestions List */}
          <div data-testid="ai-suggestions-section">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Suggested Items ({suggestions.length})
              </h3>
              {suggestions.length > 0 && (
                <button
                  onClick={handleRefreshSuggestions}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  title="Refresh suggestions"
                  aria-label="Refresh suggestions"
                >
                  <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              )}
            </div>
            {suggestions.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 dark:text-gray-400">
                  No additional suggestions yet. Use the form above to get personalized recommendations!
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {suggestion.text}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                          AI
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {suggestion.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => handleRemoveSuggestion(suggestion.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm font-medium py-1 px-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Remove ${suggestion.text} suggestion`}
                        title="Remove suggestion"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleAddSuggestion(suggestion)}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center gap-1"
                        aria-label={`Add ${suggestion.text} to packing list`}
                      >
                        <PlusIcon className="h-4 w-4" />
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usage Tip */}
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg flex items-start gap-2">
            <svg className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
            </svg>
            <span>
              <strong>Tip:</strong> Be specific with your refinement prompts.
              Mention activities, weather concerns, or special needs for better suggestions.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;
