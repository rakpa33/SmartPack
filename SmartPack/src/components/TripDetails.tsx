import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTripForm } from '../hooks/useTripForm';
import { generatePackingList } from '../services/apiService';
import { getWeatherIcon, getExpectedWeatherTypes } from '../utils/weatherIcons';
import { enhanceItemsWithQuantities } from '../utils/itemQuantities';
import { usePackingList } from '../hooks/usePackingList';
import { useColumnLayout } from '../hooks/useColumnLayout';
import { validateTripForm } from '../utils/tripFormValidation';
import { ArrowPathIcon, SparklesIcon, PencilIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

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
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [validFields, setValidFields] = useState<{ [k: string]: boolean }>({});
  const [isValidating, setIsValidating] = useState<{ [k: string]: boolean }>({});
  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Validate form fields using the same logic as TripForm
  const errors = validateTripForm({
    tripName: editForm.tripName,
    destinations: editForm.destinations,
    travelModes: editForm.travelModes,
    startDate: editForm.startDate,
    endDate: editForm.endDate,
    preferences: [editForm.tripDetails],
    step: 1
  });

  // Check if form is valid
  const isFormValid = () => {
    return Object.keys(errors).every(key => {
      if (key === 'destinations') {
        return !errors.destinations || errors.destinations.every(err => !err);
      }
      return !errors[key as keyof typeof errors];
    });
  };

  // Debounced validation for real-time feedback
  const debounceValidation = useCallback((fieldName: string, value: any) => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    setIsValidating(prev => ({ ...prev, [fieldName]: true }));
    validationTimeoutRef.current = setTimeout(() => {
      // Validate specific field
      const tempForm = { ...editForm };
      if (fieldName === 'tripName') tempForm.tripName = value;
      else if (fieldName === 'startDate') tempForm.startDate = value;
      else if (fieldName === 'endDate') tempForm.endDate = value;
      else if (fieldName === 'destinations') tempForm.destinations = value;
      else if (fieldName === 'travelModes') tempForm.travelModes = value;

      const fieldErrors = validateTripForm({
        tripName: tempForm.tripName,
        destinations: tempForm.destinations,
        travelModes: tempForm.travelModes,
        startDate: tempForm.startDate,
        endDate: tempForm.endDate,
        preferences: [tempForm.tripDetails],
        step: 1
      });

      // Update valid fields state
      const isFieldValid = fieldName === 'destinations'
        ? !fieldErrors.destinations || fieldErrors.destinations.every(err => !err)
        : !fieldErrors[fieldName as keyof typeof fieldErrors];

      setValidFields(prev => ({ ...prev, [fieldName]: isFieldValid }));
      setIsValidating(prev => ({ ...prev, [fieldName]: false }));
    }, 750); // 750ms debounce
  }, [editForm]);  // Auto-save when editForm changes (for first-time users)
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
    // Ensure we always have at least one destination field
    const processedDestinations = destinations.length > 0 ? destinations : [''];
    const filteredDestinations = processedDestinations.filter(d => d.trim());
    const finalDestinations = filteredDestinations.length > 0 ? filteredDestinations : [''];

    setEditForm({
      tripName: tripName || '',
      startDate: startDate || '',
      endDate: endDate || '',
      destinations: finalDestinations,
      travelModes: [...travelModes],
      tripDetails: preferences.length > 0 ? preferences[0] || '' : ''
    });

    // Clear touched state when entering edit mode
    setTouched({});
    setIsEditing(true);
  };  // Save edited trip details
  const handleSaveEdit = () => {
    if (!isFormValid()) {
      return; // Don't save if form is invalid
    }

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
    if (!isFormValid()) {
      return; // Don't proceed if form is invalid
    }

    // Auto-save the form first
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

    setIsUpdating(true);
    try {
      const tripData = {
        name: editForm.tripName,
        startDate: editForm.startDate,
        endDate: editForm.endDate,
        destinations: editForm.destinations.filter(d => d.trim()),
        travelModes: editForm.travelModes,
        tripDetails: editForm.tripDetails
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
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="trip-name">
              Trip Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="trip-name"
              type="text"
              value={editForm.tripName}
              onChange={(e) => {
                const value = e.target.value;
                setEditForm(prev => ({ ...prev, tripName: value }));
                debounceValidation('tripName', value);
              }}
              onBlur={() => setTouched(t => ({ ...t, tripName: true }))}
              className={`w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 min-h-[44px] focus:ring-2 transition-colors ${touched.tripName && errors.tripName
                  ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                  : validFields.tripName && touched.tripName
                    ? 'border-green-500 dark:border-green-400 focus:ring-green-500 focus:border-green-500'
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                }`}
              placeholder="e.g., Summer Vacation in Italy"
              aria-describedby={touched.tripName && errors.tripName ? "trip-name-error" : "trip-name-hint"}
              aria-invalid={touched.tripName && errors.tripName ? "true" : "false"}
              autoComplete="off"
            />
            <p id="trip-name-hint" className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Give your trip a memorable name to help organize your packing
            </p>
            {touched.tripName && validFields.tripName && !errors.tripName && (
              <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4" />
                Great! Your trip name looks good
              </p>
            )}
            {touched.tripName && errors.tripName && (
              <p id="trip-name-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                <span className="text-red-500">⚠</span>
                {errors.tripName}
              </p>
            )}
          </div>

          {/* Mobile-first single column layout for dates */}
          <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-3">
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="start-date">
                Start Date <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="start-date"
                type="date"
                value={editForm.startDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditForm(prev => ({ ...prev, startDate: value }));
                  debounceValidation('startDate', value);
                }}
                onBlur={() => setTouched(t => ({ ...t, startDate: true }))}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 min-h-[44px] focus:ring-2 transition-colors ${touched.startDate && errors.startDate
                    ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                    : validFields.startDate && touched.startDate
                      ? 'border-green-500 dark:border-green-400 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                aria-describedby={touched.startDate && errors.startDate ? "start-date-error" : undefined}
                aria-invalid={touched.startDate && errors.startDate ? "true" : "false"}
              />
              {touched.startDate && validFields.startDate && !errors.startDate && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  Start date confirmed
                </p>
              )}
              {touched.startDate && errors.startDate && (
                <p id="start-date-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                  <span className="text-red-500">⚠</span>
                  {errors.startDate}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="end-date">
                End Date <span className="text-red-500" aria-label="required">*</span>
              </label>
              <input
                id="end-date"
                type="date"
                value={editForm.endDate}
                onChange={(e) => {
                  const value = e.target.value;
                  setEditForm(prev => ({ ...prev, endDate: value }));
                  debounceValidation('endDate', value);
                }}
                onBlur={() => setTouched(t => ({ ...t, endDate: true }))}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 min-h-[44px] focus:ring-2 transition-colors ${touched.endDate && errors.endDate
                    ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                    : validFields.endDate && touched.endDate
                      ? 'border-green-500 dark:border-green-400 focus:ring-green-500 focus:border-green-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                aria-describedby={touched.endDate && errors.endDate ? "end-date-error" : undefined}
                aria-invalid={touched.endDate && errors.endDate ? "true" : "false"}
              />
              {touched.endDate && validFields.endDate && !errors.endDate && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircleIcon className="h-4 w-4" />
                  End date confirmed
                </p>
              )}
              {touched.endDate && errors.endDate && (
                <p id="end-date-error" className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                  <span className="text-red-500">⚠</span>
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Destinations <span className="text-red-500" aria-label="required">*</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Add the cities or places you'll be visiting during your trip
            </p>
            <div className="space-y-2">
              {editForm.destinations.map((dest, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        id={`destination-${index}`}
                        type="text"
                        value={dest}
                        onChange={(e) => {
                          const newDests = [...editForm.destinations];
                          newDests[index] = e.target.value;
                          setEditForm(prev => ({ ...prev, destinations: newDests }));
                          setTouched(t => ({ ...t, [`destinations_${index}`]: true }));
                          debounceValidation(`destinations_${index}`, e.target.value);
                        }}
                        className={`w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 min-h-[44px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${validFields[`destinations_${index}`] && dest.trim()
                            ? 'border-green-500 dark:border-green-400 ring-1 ring-green-500/20'
                            : touched[`destinations_${index}`] && errors.destinations && errors.destinations[index]
                              ? 'border-red-500 dark:border-red-400 focus:ring-red-500 focus:border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        placeholder="e.g., Paris, Rome, Tokyo"
                        aria-describedby={touched[`destinations_${index}`] && errors.destinations && errors.destinations[index] ? `destination-${index}-error` : undefined}
                        aria-invalid={touched[`destinations_${index}`] && errors.destinations && errors.destinations[index] ? "true" : "false"}
                        autoComplete="address-level2"
                      />
                      {validFields[`destinations_${index}`] && dest.trim() && (
                        <CheckCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" aria-hidden="true" />
                      )}
                      {isValidating[`destinations_${index}`] && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" aria-hidden="true"></div>
                        </div>
                      )}
                    </div>
                    {touched[`destinations_${index}`] && errors.destinations && errors.destinations[index] && (
                      <p id={`destination-${index}-error`} className="text-red-500 text-sm mt-1 flex items-center gap-1" role="alert">
                        <span className="text-red-500">⚠</span>
                        {errors.destinations?.[index]}
                      </p>
                    )}
                    {validFields[`destinations_${index}`] && dest.trim() && (
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1 flex items-center gap-1">
                        <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                        Great! Destination added
                      </p>
                    )}
                  </div>
                  {editForm.destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newDests = editForm.destinations.filter((_, i) => i !== index);
                        setEditForm(prev => ({ ...prev, destinations: newDests }));
                      }}
                      className="min-h-[44px] px-3 py-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm font-medium bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-md transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
                      aria-label={`Remove destination ${index + 1}`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setEditForm(prev => ({ ...prev, destinations: [...prev.destinations, ''] }))}
              className="mt-3 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              <span className="text-lg">+</span>
              Add Another Destination
            </button>
          </div>          <fieldset className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <legend className="block text-sm font-medium mb-2 px-2 bg-white dark:bg-gray-800">
              Travel Modes <span className="text-red-500" aria-label="required">*</span>
            </legend>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Select all modes of transportation you'll use during your trip. This helps us suggest appropriate packing items.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {['Car', 'Plane', 'Train', 'Bus', 'Boat'].map(mode => (
                <label
                  key={mode}
                  className={`inline-flex items-center text-sm cursor-pointer group p-3 rounded-md border transition-all min-h-[44px] ${editForm.travelModes.includes(mode)
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-900 dark:text-blue-100'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={editForm.travelModes.includes(mode)}
                    onChange={(e) => {
                      const newModes = e.target.checked
                        ? [...editForm.travelModes, mode]
                        : editForm.travelModes.filter(m => m !== mode);

                      setEditForm(prev => ({ ...prev, travelModes: newModes }));
                      setTouched(t => ({ ...t, travelModes: true }));
                      debounceValidation('travelModes', newModes);
                    }}
                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    aria-describedby={touched.travelModes && errors.travelModes ? "travel-modes-error" : undefined}
                  />
                  <span className="select-none transition-colors flex-1">
                    {mode}
                  </span>
                  {editForm.travelModes.includes(mode) && (
                    <CheckCircleIcon className="h-4 w-4 text-blue-600 ml-2" aria-hidden="true" />
                  )}
                </label>
              ))}
            </div>
            {editForm.travelModes.length > 0 && (
              <p className="text-green-600 dark:text-green-400 text-sm mt-3 flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                {editForm.travelModes.length} travel mode{editForm.travelModes.length !== 1 ? 's' : ''} selected
              </p>
            )}
            {touched.travelModes && errors.travelModes && (
              <p id="travel-modes-error" className="text-red-500 text-sm mt-2 flex items-center gap-1" role="alert">
                <span className="text-red-500">⚠</span>
                {errors.travelModes}
              </p>
            )}
          </fieldset>

          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="trip-details">
              Trip Details <span className="text-gray-500">(Optional)</span>
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Describe your trip activities, special events, or any specific packing needs. The more details you provide, the better your packing suggestions will be!
            </p>
            <div className="relative">
              <textarea
                id="trip-details"
                value={editForm.tripDetails}
                onChange={(e) => {
                  setEditForm(prev => ({ ...prev, tripDetails: e.target.value }));
                  debounceValidation('tripDetails', e.target.value);
                }}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-800 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${editForm.tripDetails.trim() && editForm.tripDetails.length > 10
                    ? 'border-green-500 dark:border-green-400 ring-1 ring-green-500/20'
                    : 'border-gray-300 dark:border-gray-600'
                  }`}
                placeholder="e.g., Business meetings, beach activities, formal dinner, hiking, photography, conference presentations..."
                rows={4}
                maxLength={500}
                aria-describedby="trip-details-hint trip-details-counter"
              />
              {editForm.tripDetails.trim() && editForm.tripDetails.length > 10 && (
                <CheckCircleIcon className="absolute right-3 top-3 h-5 w-5 text-green-500" aria-hidden="true" />
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <p id="trip-details-hint" className="text-xs text-gray-500 dark:text-gray-400">
                This helps generate more accurate packing suggestions
              </p>
              <p id="trip-details-counter" className={`text-xs ${editForm.tripDetails.length > 450
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-500 dark:text-gray-400'
                }`}>
                {editForm.tripDetails.length}/500 characters
              </p>
            </div>
            {editForm.tripDetails.trim() && editForm.tripDetails.length > 10 && (
              <p className="text-green-600 dark:text-green-400 text-sm mt-2 flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4" aria-hidden="true" />
                Great! These details will help create better packing suggestions
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Form validation status */}
            <div className="text-center">
              {isFormValid() ? (
                <p className="text-green-600 dark:text-green-400 text-sm flex items-center justify-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                  All required fields completed - Ready to generate your packing list!
                </p>
              ) : (
                <p className="text-amber-600 dark:text-amber-400 text-sm flex items-center justify-center gap-2">
                  <span className="text-amber-500">⚠</span>
                  Please complete all required fields to continue
                </p>
              )}
            </div>

            {/* Primary Action - Most prominent */}
            <button
              type="button"
              onClick={handleUpdatePackingList}
              disabled={isUpdating || !isFormValid()}
              className={`w-full min-h-[48px] px-6 py-3 rounded-lg text-base font-semibold flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all transform ${isFormValid() && !isUpdating
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
            >
              {isUpdating ? (
                <>
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  Generating Your Packing List...
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-5 w-5" />
                  🎒 Generate Complete Packing List
                </>
              )}
            </button>

            {/* Secondary Actions for returning users */}
            {!isFirstTimeUser && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!isFormValid()}
                  className={`flex-1 min-h-[44px] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 focus:ring-2 focus:outline-none transition-all ${isFormValid()
                      ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <PencilIcon className="h-4 w-4" />
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleUpdateSuggestions}
                  disabled={isUpdating || !isFormValid()}
                  className={`flex-1 min-h-[44px] px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 focus:ring-2 focus:outline-none transition-all ${isFormValid() && !isUpdating
                      ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    }`}
                >
                  {isUpdating ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      ✨ Update Suggestions Only
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tertiary Action - Cancel */}
            {!isFirstTimeUser && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="min-h-[44px] px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:outline-none transition-colors"
              >
                Cancel Changes
              </button>
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
