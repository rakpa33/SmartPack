// Test the EXACT user scenario described
console.log('=== EXACT USER SCENARIO TEST ===');

// SCENARIO: User loads form → selects Train → unselects Train → should see error

// Initial form state (empty form)
let editForm = {
  tripName: '',
  destinations: [''], 
  travelModes: [],
  startDate: '',
  endDate: ''
};

let hasStartedFilling = false;
let touched = {};

function simulateUseEffect(form, currentHasStartedFilling) {
  const hasAnyContent = form.tripName.trim() || 
                       form.destinations.some(d => d.trim()) || 
                       form.travelModes.length > 0 ||
                       form.startDate || 
                       form.endDate;
  
  console.log('  useEffect check - hasAnyContent:', hasAnyContent);
  console.log('  current hasStartedFilling:', currentHasStartedFilling);
  
  if (hasAnyContent && !currentHasStartedFilling) {
    console.log('  → Setting hasStartedFilling to true');
    return true;
  }
  return currentHasStartedFilling;
}

function simulateHandleTravelModeChange(mode, currentTravelModes, currentTouched) {
  const newTravelModes = currentTravelModes.includes(mode)
    ? currentTravelModes.filter(m => m !== mode)
    : [...currentTravelModes, mode];
    
  const newTouched = { ...currentTouched, travelModes: true };
  
  console.log('  handleTravelModeChange - mode:', mode);
  console.log('  old travelModes:', currentTravelModes);
  console.log('  new travelModes:', newTravelModes);
  console.log('  setting touched.travelModes to true');
  
  return { newTravelModes, newTouched };
}

function checkErrorDisplay(touchedTravelModes, hasStartedFillingValue) {
  const errorExists = editForm.travelModes.length === 0 ? 'Select at least one travel mode.' : '';
  const shouldShow = (touchedTravelModes || hasStartedFillingValue) && errorExists;
  
  console.log('  Error display check:');
  console.log('    touched.travelModes:', touchedTravelModes);
  console.log('    hasStartedFilling:', hasStartedFillingValue);  
  console.log('    errorExists:', !!errorExists);
  console.log('    condition result:', shouldShow);
  
  return shouldShow;
}

console.log('\n1. INITIAL STATE (user loads form):');
console.log('editForm:', editForm);
console.log('hasStartedFilling:', hasStartedFilling);
console.log('touched:', touched);
hasStartedFilling = simulateUseEffect(editForm, hasStartedFilling);

console.log('\n2. USER SELECTS TRAIN:');
const selectResult = simulateHandleTravelModeChange('Train', editForm.travelModes, touched);
editForm.travelModes = selectResult.newTravelModes;
touched = selectResult.newTouched;
hasStartedFilling = simulateUseEffect(editForm, hasStartedFilling);
console.log('After select - hasStartedFilling:', hasStartedFilling);
checkErrorDisplay(touched.travelModes, hasStartedFilling);

console.log('\n3. USER UNSELECTS TRAIN:');
const unselectResult = simulateHandleTravelModeChange('Train', editForm.travelModes, touched);
editForm.travelModes = unselectResult.newTravelModes;
touched = unselectResult.newTouched;
hasStartedFilling = simulateUseEffect(editForm, hasStartedFilling);
console.log('After unselect - hasStartedFilling:', hasStartedFilling);
const shouldShowError = checkErrorDisplay(touched.travelModes, hasStartedFilling);

console.log('\n4. EXPECTED vs ACTUAL:');
console.log('EXPECTED: Error should display (user reports it does not)');
console.log('ACTUAL based on logic:', shouldShowError);

if (shouldShowError) {
  console.log('✅ Logic says error SHOULD display - the bug might be elsewhere');
  console.log('Possible issues:');
  console.log('  - CSS styling hiding the error');
  console.log('  - React rendering issue');
  console.log('  - DOM structure problem');
  console.log('  - Race condition with state updates');
} else {
  console.log('❌ Logic says error should NOT display - this is the bug!');
}

console.log('\n=== TEST COMPLETE ===');