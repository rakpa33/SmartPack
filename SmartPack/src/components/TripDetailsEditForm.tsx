import React, { useState } from 'react';
import type { TripFormState } from '../hooks/TripFormTypes';
import type { TripFormErrors } from '../utils/tripFormValidation';
import { validateTripForm } from '../utils/tripFormValidation';
import { geocodeCity } from '../utils/geocode';
import { fetchWeather } from '../utils/weather';
import { generatePackingList } from '../services/apiService';
import type { WeatherData } from '../services/apiService';
import type { TripFormData } from '../types';

interface TripDetailsEditFormProps {
  tripName?: string;
  startDate?: string;
  endDate?: string;
  destinations?: string[];
  travelModes?: string[];
  preferences?: string[];
  onSave: (data: TripFormState) => void;
  onCancel: () => void;
}

export const TripDetailsEditForm: React.FC<TripDetailsEditFormProps> = ({
  tripName = '',
  startDate = '',
  endDate = '',
  destinations = [],
  travelModes = [],
  preferences = [''],
  onSave,
  onCancel,
}) => {
  const [editForm, setEditForm] = useState<TripFormState>({
    tripName,
    startDate,
    endDate,
    destinations: destinations.length > 0 ? destinations : [''],
    travelModes,
    preferences,
    step: 2,
  });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);

  const errors: TripFormErrors = validateTripForm(editForm);

  const handleChange = (field: keyof TripFormState, value: string | string[]) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDestinationChange = (idx: number, value: string) => {
    setEditForm(prev => ({
      ...prev,
      destinations: prev.destinations.map((d, i) => (i === idx ? value : d)),
    }));
  };

  const handleAddDestination = () => {
    setEditForm(prev => ({ ...prev, destinations: [...prev.destinations, ''] }));
  };

  const handleRemoveDestination = (idx: number) => {
    setEditForm(prev => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== idx),
    }));
  };

  const handleTravelModeChange = (mode: string) => {
    setEditForm(prev => ({
      ...prev,
      travelModes: prev.travelModes.includes(mode)
        ? prev.travelModes.filter(m => m !== mode)
        : [...prev.travelModes, mode],
    }));
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleDestinationBlur = async (idx: number) => {
    const city = editForm.destinations[idx];
    
    if (!city.trim()) {
      return;
    }

    try {
      const geo = await geocodeCity(city);
      
      if (geo && geo.display_name && geo.display_name !== city) {
        setEditForm(prev => ({
          ...prev,
          destinations: prev.destinations.map((d, i) => i === idx ? geo.display_name : d)
        }));
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const isFormValid =
    !errors.tripName &&
    editForm.destinations.length > 0 &&
    editForm.destinations.every((_, i) => !errors.destinations?.[i] || errors.destinations[i] === '') &&
    !errors.travelModes &&
    !errors.startDate &&
    !errors.endDate;

  const handleSave = async () => {
    setTouched({
      tripName: true,
      startDate: true,
      endDate: true,
      travelModes: true,
      ...Object.fromEntries(editForm.destinations.map((_, i) => [`destinations_${i}`, true])),
    });
    if (isFormValid) {
      setIsSaving(true);
      console.log('📋 Saving trip details and generating packing list...');
      
      // Fetch weather for the first destination if we have dates
      let weatherData: TripFormState['weather'] = undefined;
      let weatherDataForAPI: WeatherData[] = [];
      
      if (editForm.destinations.length > 0 && editForm.startDate && editForm.endDate) {
        try {
          const firstDestination = editForm.destinations[0];
          const geo = await geocodeCity(firstDestination);
          if (geo && geo.lat && geo.lon) {
            const rawWeather = await fetchWeather(geo.lat, geo.lon, editForm.startDate, editForm.endDate);
            if (rawWeather) {
              // Convert to match TripFormState weather type
              weatherData = {
                temperature: rawWeather.temperature,
                temperatureMin: rawWeather.temperatureMin,
                temperatureMax: rawWeather.temperatureMax,
                weathercode: rawWeather.weathercode ?? undefined,
                weathercodeEnd: rawWeather.weathercodeEnd ?? undefined,
                averageTemp: rawWeather.averageTemp,
                summary: rawWeather.summary
              };
              console.log('✅ Weather fetched:', weatherData);
              
              // Prepare weather data for API
              weatherDataForAPI = [{
                location: firstDestination,
                temperature: rawWeather.averageTemp || rawWeather.temperatureMax || 20,
                conditions: rawWeather.summary || 'Clear',
                precipitation: 0
              }];
            }
          }
        } catch (error) {
          console.error('Failed to fetch weather:', error);
          // Continue without weather data
        }
      }
      
      // Generate packing list with Ollama
      let generatedPackingList = undefined;
      try {
        console.log('🤖 Calling Ollama to generate packing list...');
        
        // Convert trip state to API format
        const tripData: TripFormData = {
          name: editForm.tripName,
          startDate: editForm.startDate,
          endDate: editForm.endDate,
          destinations: editForm.destinations.filter(d => d?.trim()),
          travelModes: editForm.travelModes,
          tripDetails: `Travel preferences: ${editForm.preferences?.join(', ') || 'general travel'}. Weather: ${weatherData?.summary || 'unknown conditions'}.`
        };
        
        // Call API to generate packing list
        const result = await generatePackingList(tripData, weatherDataForAPI);
        generatedPackingList = result;
        console.log('✅ Packing list generated successfully:', result);
      } catch (error) {
        console.error('Failed to generate packing list:', error);
        // Continue without packing list - user can try again later
      }
      
      // Save with weather data and generated packing list
      const formWithWeatherAndPacking: TripFormState = {
        ...editForm,
        weather: weatherData || editForm.weather,
        generatedPackingList: generatedPackingList || editForm.generatedPackingList
      };
      onSave(formWithWeatherAndPacking);
      setIsSaving(false);
    }
  };

  return (
    <form className="space-y-6 max-w-xl mx-auto p-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
      {/* Trip Name */}
      <div>
        <label htmlFor="tripName" className="block font-medium text-gray-900 dark:text-gray-100">Trip Name</label>
        <input
          id="tripName"
          type="text"
          className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
          value={editForm.tripName}
          onChange={e => handleChange('tripName', e.target.value)}
          onBlur={() => handleBlur('tripName')}
          aria-invalid={!!errors.tripName}
          aria-describedby="tripName-error"
        />
        {touched.tripName && errors.tripName && (
          <div id="tripName-error" className="text-error text-sm" role="alert">{errors.tripName}</div>
        )}
      </div>

      {/* Destinations */}
      <div>
        <label className="block font-medium text-gray-900 dark:text-gray-100">Destinations</label>
        {editForm.destinations.map((d, i) => (
          <div key={i} className="mb-2">
            <div className="flex items-center gap-2">
              <label htmlFor={`destination-${i}`} className="sr-only">Destination</label>
              <input
                id={`destination-${i}`}
                type="text"
                className="input input-bordered flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
                value={d}
                onChange={e => handleDestinationChange(i, e.target.value)}
                onBlur={() => {
                  handleBlur(`destinations_${i}`);
                  handleDestinationBlur(i);
                }}
                aria-invalid={!!(errors.destinations && errors.destinations[i])}
                aria-describedby={`destinations-error-${i}`}
                data-testid={`destination-input-${i}`}
              />
              {editForm.destinations.length > 1 && (
                <button type="button" onClick={() => handleRemoveDestination(i)} aria-label="Remove destination" className="btn btn-sm btn-error">Remove</button>
              )}
            </div>
            {touched[`destinations_${i}`] && errors.destinations && errors.destinations[i] && (
              <div id={`destinations-error-${i}`} className="text-error text-sm mt-1" role="alert">{errors.destinations[i]}</div>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddDestination} className="btn btn-sm btn-primary mt-1">Add Destination</button>
      </div>

      {/* Travel Modes */}
      <div>
        <label className="block font-medium text-gray-900 dark:text-gray-100">Travel Modes</label>
        <div className="flex gap-4 flex-wrap">
          {['Car', 'Plane', 'Train', 'Bus', 'Boat'].map(mode => (
            <label key={mode} className="inline-flex items-center gap-1 text-gray-900 dark:text-gray-100">
              <input
                type="checkbox"
                checked={editForm.travelModes.includes(mode)}
                onChange={() => handleTravelModeChange(mode)}
              />
              {mode}
            </label>
          ))}
        </div>
        {touched.travelModes && errors.travelModes && (
          <div className="text-error text-sm" role="alert">{errors.travelModes}</div>
        )}
      </div>

      {/* Dates */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="block font-medium text-gray-900 dark:text-gray-100">Start Date</label>
          <input
            id="startDate"
            type="date"
            className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
            value={editForm.startDate}
            onChange={e => handleChange('startDate', e.target.value)}
            onBlur={() => handleBlur('startDate')}
            aria-invalid={!!errors.startDate}
            aria-describedby="startDate-error"
          />
          {touched.startDate && errors.startDate && (
            <div id="startDate-error" className="text-error text-sm" role="alert">{errors.startDate}</div>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block font-medium text-gray-900 dark:text-gray-100">End Date</label>
          <input
            id="endDate"
            type="date"
            className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
            value={editForm.endDate}
            onChange={e => handleChange('endDate', e.target.value)}
            onBlur={() => handleBlur('endDate')}
            aria-invalid={!!errors.endDate}
            aria-describedby="endDate-error"
          />
          {touched.endDate && errors.endDate && (
            <div id="endDate-error" className="text-error text-sm" role="alert">{errors.endDate}</div>
          )}
        </div>
      </div>

      {/* Preferences (Trip Details) */}
      <div>
        <label htmlFor="preferences" className="block font-medium text-gray-900 dark:text-gray-100">Trip Details (optional)</label>
        <textarea
          id="preferences"
          className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 min-h-[100px]"
          value={editForm.preferences[0] || ''}
          onChange={e => handleChange('preferences', [e.target.value])}
          placeholder="E.g. Accessibility needs, tech needs, access to laundry, pet/child-friendly, language/translation support, attending special event, outdoor/adventure activities, business travel, minimalist packing, health & wellness needs, medication required, sun/insect protection, water activities, hiking, gifts/souvenirs, or anything else that will help us personalize your packing list."
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={!isFormValid || isSaving}>
          {isSaving ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Saving & Generating...
            </span>
          ) : (
            'Save'
          )}
        </button>
      </div>
    </form>
  );
};
