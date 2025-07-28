import React, { useState, useEffect } from 'react';
import { useTripForm } from '../hooks/useTripForm';
import { usePackingList } from '../hooks/usePackingList';
import { generatePackingList, type WeatherData } from '../services/apiService';
import type { TripFormData } from '../types';

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
      tripDetails: customPrompt.trim()
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
      const response = await generatePackingList(tripData, weatherData);

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
          <div className="text-4xl mb-4">🤖</div>
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
          <div>
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">
              Suggested Items ({suggestions.length})
            </h3>
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
                    <button
                      onClick={() => handleAddSuggestion(suggestion)}
                      className="ml-3 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-1 px-3 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      aria-label={`Add ${suggestion.text} to packing list`}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Usage Tip */}
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            💡 <strong>Tip:</strong> Be specific with your refinement prompts.
            Mention activities, weather concerns, or special needs for better suggestions.
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionsPanel;
