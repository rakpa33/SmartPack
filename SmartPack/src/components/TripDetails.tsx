import React, { useState, useEffect } from 'react';
import { useTripForm } from '../hooks/useTripForm';
import { generatePackingList } from '../services/apiService';
import { getWeatherIcon, getExpectedWeatherTypes } from '../utils/weatherIcons';
import { enhanceItemsWithQuantities } from '../utils/itemQuantities';
import { usePackingList } from '../hooks/usePackingList';
import { useColumnLayout } from '../hooks/useColumnLayout';
import { ArrowPathIcon, SparklesIcon, PencilIcon } from '@heroicons/react/24/solid';

/**
 * TripDetails: Displays submitted trip data in the left column of MainLayout.
 * Now supports editing trip details and updating packing lists.
 */
export const TripDetails: React.FC = () => {
  const { state, dispatch } = useTripForm();
  const { loadAiGeneratedItems } = usePackingList();
  const { toggleColumn } = useColumnLayout();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [editForm, setEditForm] = useState<{
    tripName: string;
    startDate: string;
    endDate: string;
    destinations: string[];
    travelModes: string[];
    tripDetails: string;
  }>({
    tripName: '',
    startDate: '',
    endDate: '',
    destinations: [''],
    travelModes: [],
    tripDetails: ''
  });

  // Enhanced error handling - provide clear fallback for incomplete state
  if (!state) {
    console.log('TripDetails: No state found');
    return <div>Loading trip details...</div>;
  }

  // Explicit check for step=2 (completed form)
  if (state.step < 2) {
    console.log('TripDetails: Form not completed, step is', state.step);
    return <div>Please complete the trip form</div>;
  }

  const {
    tripName,
    startDate,
    endDate,
    destinations,
    travelModes,
    preferences,
    weather,
  } = state;

  // Check if this is a first-time user (no data filled)
  const isFirstTimeUser = !tripName &&
    destinations.length === 1 &&
    !destinations[0] &&
    travelModes.length === 0;

  // Check if this is a first-time user and auto-start editing
  useEffect(() => {
    if (isFirstTimeUser && !isEditing) {
      handleEditMode();
    }
  }, [isFirstTimeUser, isEditing]);

  // Auto-save when editForm changes (for first-time users)
  useEffect(() => {
    if (isEditing && editForm.tripName.trim()) {
      const timeoutId = setTimeout(() => {
        handleSaveEdit();
      }, 1000); // Auto-save after 1 second of no changes

      return () => clearTimeout(timeoutId);
    }
  }, [editForm, isEditing]);

  // Initialize edit form when entering edit mode
  const handleEditMode = () => {
    setEditForm({
      tripName: tripName || '',
      startDate: startDate || '',
      endDate: endDate || '',
      destinations: destinations.length > 0 ? destinations.filter(d => d.trim()) : [''],
      travelModes: [...travelModes],
      tripDetails: preferences.length > 0 ? preferences[0] || '' : ''
    });
    setIsEditing(true);
  };

  // Save edited trip details
  const handleSaveEdit = () => {
    const updatedState = {
      ...state,
      tripName: editForm.tripName,
      startDate: editForm.startDate,
      endDate: editForm.endDate,
      destinations: editForm.destinations.filter(d => d.trim()),
      travelModes: editForm.travelModes,
      preferences: [editForm.tripDetails]
    };

    dispatch({
      type: 'SET_FORM_STATE',
      value: updatedState
    });

    // Check if form is now complete to show other columns
    const isFormComplete = updatedState.tripName.trim() &&
      updatedState.destinations.length > 0 &&
      updatedState.destinations.some(d => d.trim()) &&
      updatedState.travelModes.length > 0 &&
      updatedState.startDate &&
      updatedState.endDate;

    if (isFormComplete) {
      // Show other columns once form is validated
      setTimeout(() => {
        toggleColumn('packingChecklist'); // Show packing checklist
        toggleColumn('suggestions'); // Show suggestions
      }, 100);
    }

    setIsEditing(false);
  };

  // Update full packing checklist
  const handleUpdatePackingList = async () => {
    setIsUpdating(true);
    try {
      const tripData = {
        name: tripName || '',
        startDate: startDate || '',
        endDate: endDate || '',
        destinations: destinations.filter(d => d.trim()),
        travelModes: travelModes,
        tripDetails: preferences.length > 0 ? preferences[0] || '' : ''
      };

      const weatherData = weather ? [{
        location: destinations[0] || 'Unknown',
        temperature: weather.temperature || 20,
        conditions: weather.summary || 'Clear',
        precipitation: 0
      }] : [];

      const response = await generatePackingList(tripData, weatherData);

      if (response.checklist) {
        // Enhance items with quantities based on trip length
        const enhancedChecklist = enhanceItemsWithQuantities(
          response.checklist,
          startDate,
          endDate
        );
        loadAiGeneratedItems(enhancedChecklist);
      }

      // Update context with new generated list (with enhanced items)
      dispatch({
        type: 'SET_FORM_STATE',
        value: {
          ...state,
          generatedPackingList: {
            ...response,
            checklist: response.checklist ? enhanceItemsWithQuantities(response.checklist, startDate, endDate) : []
          }
        }
      });
    } catch (error) {
      console.error('Error updating packing list:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Update suggestions only
  const handleUpdateSuggestions = async () => {
    setIsUpdating(true);
    try {
      const tripData = {
        name: tripName || '',
        startDate: startDate || '',
        endDate: endDate || '',
        destinations: destinations.filter(d => d.trim()),
        travelModes: travelModes,
        tripDetails: 'Update suggestions only: ' + (preferences.length > 0 ? preferences[0] || '' : '')
      };

      const weatherData = weather ? [{
        location: destinations[0] || 'Unknown',
        temperature: weather.temperature || 20,
        conditions: weather.summary || 'Clear',
        precipitation: 0
      }] : [];

      const response = await generatePackingList(tripData, weatherData);

      // Update only the suggested items, keep existing checklist
      dispatch({
        type: 'SET_FORM_STATE',
        value: {
          ...state,
          generatedPackingList: {
            checklist: state.generatedPackingList?.checklist || [],
            suggestedItems: response.suggestedItems || []
          }
        }
      });
    } catch (error) {
      console.error('Error updating suggestions:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get weather types for trip
  const weatherTypes = weather ? getExpectedWeatherTypes(weather.weathercode, weather.weathercodeEnd) : [];

  // Temperature conversion helpers
  const convertTemp = (celsius: number, unit: 'C' | 'F') => {
    if (unit === 'F') {
      return Math.round((celsius * 9 / 5) + 32);
    }
    return Math.round(celsius);
  };

  const formatTemp = (celsius: number | null, unit: 'C' | 'F') => {
    if (celsius === null) return 'N/A';
    return `${convertTemp(celsius, unit)}°${unit}`;
  };

  // Debug: log the state to see if weather data is present
  console.log('TripDetails state:', state);
  console.log('Weather data:', weather);

  return (
    <div data-testid="trip-details-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trip Details</h2>
        {!isEditing && (
          <button
            onClick={handleEditMode}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium"
          >
            <PencilIcon className="h-4 w-4" />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Trip Name</label>
            <input
              type="text"
              value={editForm.tripName}
              onChange={(e) => setEditForm(prev => ({ ...prev, tripName: e.target.value }))}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={editForm.startDate}
                onChange={(e) => setEditForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={editForm.endDate}
                onChange={(e) => setEditForm(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destinations</label>
            {editForm.destinations.map((dest, index) => (
              <div key={index} className="flex gap-2 mb-1">
                <input
                  type="text"
                  value={dest}
                  onChange={(e) => {
                    const newDests = [...editForm.destinations];
                    newDests[index] = e.target.value;
                    setEditForm(prev => ({ ...prev, destinations: newDests }));
                  }}
                  className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                />
                {editForm.destinations.length > 1 && (
                  <button
                    onClick={() => {
                      const newDests = editForm.destinations.filter((_, i) => i !== index);
                      setEditForm(prev => ({ ...prev, destinations: newDests }));
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setEditForm(prev => ({ ...prev, destinations: [...prev.destinations, ''] }))}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Add Destination
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Travel Modes</label>
            <div className="flex flex-wrap gap-2">
              {['Car', 'Plane', 'Train', 'Bus', 'Boat'].map(mode => (
                <label key={mode} className="inline-flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={editForm.travelModes.includes(mode)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditForm(prev => ({ ...prev, travelModes: [...prev.travelModes, mode] }));
                      } else {
                        setEditForm(prev => ({ ...prev, travelModes: prev.travelModes.filter(m => m !== mode) }));
                      }
                    }}
                    className="mr-1"
                  />
                  {mode}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Trip Details</label>
            <textarea
              value={editForm.tripDetails}
              onChange={(e) => setEditForm(prev => ({ ...prev, tripDetails: e.target.value }))}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800 h-20"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {/* For first-time users, show only Update Full List button, no Save/Cancel */}
            {!isFirstTimeUser && (
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
              >
                <PencilIcon className="h-3 w-3" />
                Save
              </button>
            )}
            <button
              onClick={handleUpdatePackingList}
              disabled={isUpdating}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              {isUpdating ? (
                <>
                  <ArrowPathIcon className="h-3 w-3 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-3 w-3" />
                  Update Full List
                </>
              )}
            </button>
            {/* Hide Update Suggestions and Cancel for first-time users */}
            {!isFirstTimeUser && (
              <>
                <button
                  onClick={handleUpdateSuggestions}
                  disabled={isUpdating}
                  className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {isUpdating ? (
                    <>
                      <ArrowPathIcon className="h-3 w-3 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-3 w-3" />
                      Update Suggestions
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded text-sm hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          <dl className="space-y-1">
            <div>
              <dt className="font-medium">Trip Name:</dt>
              <dd>{tripName || <span className="text-gray-400">(not set)</span>}</dd>
            </div>
            <div>
              <dt className="font-medium">Dates:</dt>
              <dd>{startDate && endDate ? `${startDate} – ${endDate}` : <span className="text-gray-400">(not set)</span>}</dd>
            </div>
            <div>
              <dt className="font-medium">Destinations:</dt>
              <dd>{destinations && destinations.length > 0 && destinations.some(d => d.trim())
                ? destinations.filter(d => d.trim()).join(', ')
                : <span className="text-gray-400">(none)</span>}</dd>
            </div>
            <div>
              <dt className="font-medium">Travel Modes:</dt>
              <dd>{travelModes && travelModes.length > 0
                ? travelModes.join(', ')
                : <span className="text-gray-400">(none)</span>}</dd>
            </div>
            <div>
              <dt className="font-medium">Preferences:</dt>
              <dd>{preferences && preferences.length > 0 && preferences.some(p => p.trim())
                ? preferences.filter(p => p.trim()).join(', ')
                : <span className="text-gray-400">(none)</span>}</dd>
            </div>
          </dl>

          {/* Enhanced Weather Display */}
          {weather && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded" data-testid="weather-display">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getWeatherIcon(weather.weathercode || 0)}</span>
                  <div>
                    <div className="text-lg font-semibold" data-testid="weather-summary">{weather.summary}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Temperature</div>
                  </div>
                </div>
                <button
                  onClick={() => setTempUnit(tempUnit === 'C' ? 'F' : 'C')}
                  className="text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  °{tempUnit === 'C' ? 'F' : 'C'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center">
                  <div className="font-medium text-blue-600 dark:text-blue-400">Low</div>
                  <div data-testid="weather-temperature-min">
                    {formatTemp(weather.temperatureMin, tempUnit)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-600 dark:text-blue-400">High</div>
                  <div data-testid="weather-temperature-max">
                    {formatTemp(weather.temperatureMax, tempUnit)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-600 dark:text-blue-400">Avg</div>
                  <div data-testid="weather-temperature">
                    {formatTemp(weather.averageTemp, tempUnit)}
                  </div>
                </div>
              </div>

              {weatherTypes.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Expected Weather:</div>
                  <div className="flex flex-wrap gap-2">
                    {weatherTypes.map((type, index) => (
                      <div key={index} className="flex items-center gap-1 bg-white dark:bg-gray-700 px-2 py-1 rounded text-sm">
                        <span>{type.icon}</span>
                        <span>{type.condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add a fallback div to help with testing */}
          {!weather && (
            <div data-testid="weather-empty">No weather data available</div>
          )}
        </>
      )}
    </div>
  );
};
