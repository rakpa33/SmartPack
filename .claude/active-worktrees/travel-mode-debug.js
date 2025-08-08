// Travel Mode Validation Debug Script
// This script will simulate the exact user scenario and debug the validation state

console.log('=== DEBUGGING TRAVEL MODE VALIDATION ===');

// Simulate the form state changes
const formState = {
  tripName: 'Test Trip',
  destinations: ['New York'],
  travelModes: [],
  startDate: '2025-08-10', 
  endDate: '2025-08-15'
};

const touched = {
  tripName: false,
  travelModes: false
};

console.log('\n1. INITIAL STATE:');
console.log('Form state:', JSON.stringify(formState, null, 2));
console.log('Touched state:', JSON.stringify(touched, null, 2));

// Step 1: User selects "Train"
console.log('\n2. USER SELECTS TRAIN:');
formState.travelModes = ['Train'];
console.log('Travel modes after selection:', formState.travelModes);
console.log('Travel modes length:', formState.travelModes.length);
console.log('Should show validation error?', formState.travelModes.length === 0);

// Step 2: User unselects "Train" 
console.log('\n3. USER UNSELECTS TRAIN:');
formState.travelModes = [];
touched.travelModes = true; // This should happen in handleTravelModeChange
console.log('Travel modes after unselection:', formState.travelModes);
console.log('Travel modes length:', formState.travelModes.length);
console.log('Touched travelModes:', touched.travelModes);
console.log('Should show validation error?', formState.travelModes.length === 0);

// Step 3: Validate using the actual validation logic
console.log('\n4. VALIDATION LOGIC:');

// Simulate the validation function
function validateTravelModes(travelModes) {
  if (!travelModes.length) {
    return 'Select at least one travel mode.';
  }
  return '';
}

const travelModeError = validateTravelModes(formState.travelModes);
console.log('Travel mode validation error:', travelModeError);

// Step 4: Check display conditions
console.log('\n5. ERROR DISPLAY CONDITIONS:');
console.log('touched.travelModes:', touched.travelModes);
console.log('travelModeError:', travelModeError);
console.log('Both conditions met for display:', touched.travelModes && travelModeError);

// The condition in the component is:
// {(touched.travelModes || hasStartedFilling) && errors.travelModes && (
//   <div className="text-error text-sm" role="alert">{errors.travelModes}</div>
// )}

console.log('\n6. COMPONENT DISPLAY CONDITION:');
console.log('Display condition: (touched.travelModes || hasStartedFilling) && errors.travelModes');
console.log('touched.travelModes:', touched.travelModes);
console.log('errors.travelModes:', travelModeError);
console.log('Will display error:', (touched.travelModes) && travelModeError);

console.log('\n=== DEBUG COMPLETE ===');