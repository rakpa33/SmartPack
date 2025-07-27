import React, { useState } from 'react';
import { useTripForm } from '../hooks/useTripForm';
import { validateTripForm } from '../utils/tripFormValidation';

export const TripForm: React.FC = () => {
  const { state, dispatch } = useTripForm();
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const errors = validateTripForm(state);

  const handleChange = (field: keyof typeof state, value: string | string[]) => {
    dispatch({ type: 'SET_FIELD', field, value });
  };

  const handleDestinationChange = (idx: number, value: string) => {
    dispatch({ type: 'UPDATE_DESTINATION', index: idx, value });
  };

  const handleAddDestination = () => {
    dispatch({ type: 'ADD_DESTINATION', value: '' });
  };

  const handleRemoveDestination = (idx: number) => {
    dispatch({ type: 'REMOVE_DESTINATION', index: idx });
  };

  const handleTravelModeChange = (mode: string) => {
    if (state.travelModes.includes(mode)) {
      dispatch({ type: 'REMOVE_TRAVEL_MODE', value: mode });
    } else {
      dispatch({ type: 'ADD_TRAVEL_MODE', value: mode });
    }
  };

  const handleNext = () => {
    setTouched({ tripName: true, destinations: true, travelModes: true, startDate: true, endDate: true });
    if (!Object.values(errors).some(Boolean)) {
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  // For demo: simple stepper UI
  return (
    <form className="space-y-6 max-w-xl mx-auto p-4">
      {/* Step 1: Trip Name */}
      <div>
        <label htmlFor="tripName" className="block font-medium text-gray-900 dark:text-gray-100">Trip Name</label>
        <input
          id="tripName"
          type="text"
          className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
          value={state.tripName}
          onChange={e => handleChange('tripName', e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, tripName: true }))}
          aria-invalid={!!errors.tripName}
          aria-describedby="tripName-error"
        />
        {touched.tripName && errors.tripName && (
          <div id="tripName-error" className="text-error text-sm">{errors.tripName}</div>
        )}
      </div>

      {/* Step 2: Destinations */}
      <div>
        <label className="block font-medium text-gray-900 dark:text-gray-100">Destinations</label>
        {state.destinations.map((d, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              className="input input-bordered flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
              value={d}
              onChange={e => handleDestinationChange(i, e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, [`destinations_${i}`]: true }))}
              aria-invalid={!!(errors.destinations && errors.destinations[i])}
              aria-describedby={`destinations-error-${i}`}
            />
            {state.destinations.length > 1 && (
              <button type="button" onClick={() => handleRemoveDestination(i)} aria-label="Remove destination" className="btn btn-sm btn-error">Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddDestination} className="btn btn-sm btn-primary mt-1">Add Destination</button>
        {state.destinations.map((_, i) => (
          touched[`destinations_${i}`] && errors.destinations && errors.destinations[i] ? (
            <div key={i} id={`destinations-error-${i}`} className="text-error text-sm">{errors.destinations[i]}</div>
          ) : null
        ))}
      </div>

      {/* Step 3: Travel Modes */}
      <div>
        <label className="block font-medium text-gray-900 dark:text-gray-100">Travel Modes</label>
        <div className="flex gap-4 flex-wrap">
          {['Car', 'Plane', 'Train', 'Bus', 'Boat'].map(mode => (
            <label key={mode} className="inline-flex items-center gap-1 text-gray-900 dark:text-gray-100">
              <input
                type="checkbox"
                checked={state.travelModes.includes(mode)}
                onChange={() => handleTravelModeChange(mode)}
              />
              {mode}
            </label>
          ))}
        </div>
        {touched.travelModes && errors.travelModes && (
          <div className="text-error text-sm">{errors.travelModes}</div>
        )}
      </div>

      {/* Step 4: Dates */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="block font-medium text-gray-900 dark:text-gray-100">Start Date</label>
          <input
            id="startDate"
            type="date"
            className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
            value={state.startDate}
            onChange={e => handleChange('startDate', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, startDate: true }))}
            aria-invalid={!!errors.startDate}
            aria-describedby="startDate-error"
          />
          {touched.startDate && errors.startDate && (
            <div id="startDate-error" className="text-error text-sm">{errors.startDate}</div>
          )}
        </div>
        <div className="flex-1">
          <label htmlFor="endDate" className="block font-medium text-gray-900 dark:text-gray-100">End Date</label>
          <input
            id="endDate"
            type="date"
            className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
            value={state.endDate}
            onChange={e => handleChange('endDate', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, endDate: true }))}
            aria-invalid={!!errors.endDate}
            aria-describedby="endDate-error"
          />
          {touched.endDate && errors.endDate && (
            <div id="endDate-error" className="text-error text-sm">{errors.endDate}</div>
          )}
        </div>
      </div>

      {/* Step 5: Trip Details (long-form) */}
      <div>
        <label htmlFor="tripDetails" className="block font-medium text-gray-900 dark:text-gray-100">Trip Details (optional)</label>
        <textarea
          id="tripDetails"
          className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 min-h-[100px]"
          value={state.preferences[0] || ''}
          onChange={e => handleChange('preferences', [e.target.value])}
          placeholder="E.g. Accessibility needs, tech needs, access to laundry, pet/child-friendly, language/translation support, attending special event, outdoor/adventure activities, business travel, minimalist packing, health & wellness needs, medication required, sun/insect protection, water activities, hiking, gifts/souvenirs, or anything else that will help us personalize your packing list."
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" className="btn btn-primary" onClick={handleNext} disabled={Object.values(errors).some(Boolean)}>
          Next
        </button>
      </div>
    </form>
  );
};
