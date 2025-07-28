import React, { useState } from 'react';
import { useTripForm } from '../hooks/useTripForm';
import { validateTripForm } from '../utils/tripFormValidation';
import { useNavigate } from 'react-router-dom';

export const TripForm: React.FC = () => {
  const { dispatch } = useTripForm();
  const navigate = useNavigate();
  // Local state for all fields
  const [tripName, setTripName] = useState('');
  const [destinations, setDestinations] = useState(['']);
  const [travelModes, setTravelModes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [preferences, setPreferences] = useState(['']);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});

  // Infer step: if all required fields are filled, step = 2 (checklist), else 1 (form)
  const isFormComplete = (
    tripName.trim() &&
    destinations.every(d => d.trim()) &&
    travelModes.length > 0 &&
    startDate &&
    endDate
  );
  const step = isFormComplete ? 2 : 1;

  const errors = validateTripForm({
    tripName,
    destinations,
    travelModes,
    startDate,
    endDate,
    preferences,
    step,
  });

  const handleChange = (field: string, value: string | string[]) => {
    switch (field) {
      case 'tripName': setTripName(value as string); break;
      case 'destinations': setDestinations(value as string[]); break;
      case 'travelModes': setTravelModes(value as string[]); break;
      case 'startDate': setStartDate(value as string); break;
      case 'endDate': setEndDate(value as string); break;
      case 'preferences': setPreferences(value as string[]); break;
      default: break;
    }
  };

  const handleDestinationChange = (idx: number, value: string) => {
    setDestinations(dests => dests.map((d, i) => (i === idx ? value : d)));
  };

  const handleAddDestination = () => {
    setDestinations(dests => [...dests, '']);
  };

  const handleRemoveDestination = (idx: number) => {
    setDestinations(dests => dests.filter((_, i) => i !== idx));
  };

  const handleTravelModeChange = (mode: string) => {
    setTravelModes(modes =>
      modes.includes(mode) ? modes.filter(m => m !== mode) : [...modes, mode]
    );
  };

  const handleNext = () => {
    // Set all touched flags, including per-destination
    const touchedFields: { [k: string]: boolean } = {
      tripName: true,
      destinations: true,
      travelModes: true,
      startDate: true,
      endDate: true,
    };
    destinations.forEach((_, i) => {
      touchedFields[`destinations_${i}`] = true;
    });
    setTouched(touchedFields);
    // Always check for errors and advance if valid, regardless of touched
    const currentErrors = validateTripForm({
      tripName,
      destinations,
      travelModes,
      startDate,
      endDate,
      preferences,
      step,
    });
    const hasErrors = Object.values(currentErrors).some(err => {
      if (Array.isArray(err)) return err.some(Boolean);
      return Boolean(err);
    });
    // Debug: log errors and hasErrors
    // eslint-disable-next-line no-console
    console.log('TripForm handleNext errors:', currentErrors, 'hasErrors:', hasErrors);
    if (!hasErrors) {
      // Filter out empty destinations before syncing to context
      const filteredDestinations = destinations.filter(d => d.trim() !== '');
      dispatch({
        type: 'SET_FORM_STATE',
        value: {
          tripName,
          destinations: filteredDestinations,
          travelModes,
          startDate,
          endDate,
          preferences,
          step: 2, // Force step to 2 so checklist always appears after submit
        },
      });
      // Navigate to /MainLayout after successful submit
      navigate('/MainLayout');
    }
  };

  return (
    <form className="space-y-6 max-w-xl mx-auto p-4" onSubmit={e => {
      e.preventDefault();
      handleNext();
    }}>
      {/* Step 1: Trip Name */}
      <div>
        <label htmlFor="tripName" className="block font-medium text-gray-900 dark:text-gray-100">Trip Name</label>
        <input
          id="tripName"
          type="text"
          className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
          value={tripName}
          onChange={e => handleChange('tripName', e.target.value)}
          onBlur={() => setTouched(t => ({ ...t, tripName: true }))}
          aria-invalid={!!errors.tripName}
          aria-describedby="tripName-error"
        />
        {touched.tripName && errors.tripName && (
          <div id="tripName-error" className="text-error text-sm" role="alert">{errors.tripName}</div>
        )}
      </div>

      {/* Step 2: Destinations */}
      <div>
        <label className="block font-medium text-gray-900 dark:text-gray-100">Destinations</label>
        {destinations.map((d, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <label htmlFor={`destination-${i}`} className="sr-only">Destination</label>
            <input
              id={`destination-${i}`}
              type="text"
              className="input input-bordered flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
              value={d}
              onChange={e => handleDestinationChange(i, e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, [`destinations_${i}`]: true }))}
              aria-invalid={!!(errors.destinations && errors.destinations[i])}
              aria-describedby={`destinations-error-${i}`}
              data-testid={`destination-input-${i}`}
            />
            {destinations.length > 1 && (
              <button type="button" onClick={() => handleRemoveDestination(i)} aria-label="Remove destination" className="btn btn-sm btn-error">Remove</button>
            )}
          </div>
        ))}
        <button type="button" onClick={handleAddDestination} className="btn btn-sm btn-primary mt-1">Add Destination</button>
        {destinations.map((_, i) => (
          touched[`destinations_${i}`] && errors.destinations && errors.destinations[i] ? (
            <div key={i} id={`destinations-error-${i}`} className="text-error text-sm" role="alert">{errors.destinations[i]}</div>
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
                checked={travelModes.includes(mode)}
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

      {/* Step 4: Dates */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label htmlFor="startDate" className="block font-medium text-gray-900 dark:text-gray-100">Start Date</label>
          <input
            id="startDate"
            type="date"
            className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600"
            value={startDate}
            onChange={e => handleChange('startDate', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, startDate: true }))}
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
            value={endDate}
            onChange={e => handleChange('endDate', e.target.value)}
            onBlur={() => setTouched(t => ({ ...t, endDate: true }))}
            aria-invalid={!!errors.endDate}
            aria-describedby="endDate-error"
          />
          {touched.endDate && errors.endDate && (
            <div id="endDate-error" className="text-error text-sm" role="alert">{errors.endDate}</div>
          )}
        </div>
      </div>

      {/* Step 5: Trip Details (long-form) */}
      <div>
        <label htmlFor="tripDetails" className="block font-medium text-gray-900 dark:text-gray-100">Trip Details (optional)</label>
        <textarea
          id="tripDetails"
          className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-400 dark:border-gray-600 min-h-[100px]"
          value={preferences[0] || ''}
          onChange={e => handleChange('preferences', [e.target.value])}
          placeholder="E.g. Accessibility needs, tech needs, access to laundry, pet/child-friendly, language/translation support, attending special event, outdoor/adventure activities, business travel, minimalist packing, health & wellness needs, medication required, sun/insect protection, water activities, hiking, gifts/souvenirs, or anything else that will help us personalize your packing list."
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="submit" className="btn btn-primary">
          Next
        </button>
      </div>
    </form>
  );
};
