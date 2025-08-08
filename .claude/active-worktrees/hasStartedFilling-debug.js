// Debug the hasStartedFilling logic issue
console.log('=== DEBUGGING hasStartedFilling LOGIC ===');

// Simulate the exact state changes
let editForm = {
  tripName: '',
  destinations: [''],
  travelModes: [],
  startDate: '',
  endDate: ''
};

let hasStartedFilling = false;
let touched = { travelModes: false };

function checkHasStartedFilling(form) {
  const hasAnyContent = form.tripName.trim() || 
                       form.destinations.some(d => d.trim()) || 
                       form.travelModes.length > 0 ||
                       form.startDate || 
                       form.endDate;
  return hasAnyContent;
}

function shouldShowError(touchedTravelModes, hasStartedFillingValue, errorExists) {
  return (touchedTravelModes || hasStartedFillingValue) && errorExists;
}

console.log('\n1. INITIAL STATE (empty form):');
console.log('editForm.travelModes:', editForm.travelModes);
console.log('hasStartedFilling:', hasStartedFilling);
console.log('touched.travelModes:', touched.travelModes);
console.log('checkHasStartedFilling result:', checkHasStartedFilling(editForm));

// User selects Train
console.log('\n2. USER SELECTS TRAIN:');
editForm.travelModes = ['Train'];
const hasContentAfterSelect = checkHasStartedFilling(editForm);
if (hasContentAfterSelect && !hasStartedFilling) {
  hasStartedFilling = true;
}
console.log('editForm.travelModes:', editForm.travelModes);
console.log('hasStartedFilling after select:', hasStartedFilling);
console.log('checkHasStartedFilling result:', hasContentAfterSelect);

// User unselects Train
console.log('\n3. USER UNSELECTS TRAIN:');
editForm.travelModes = [];
touched.travelModes = true; // This happens in handleTravelModeChange
const hasContentAfterUnselect = checkHasStartedFilling(editForm);
console.log('editForm.travelModes:', editForm.travelModes);
console.log('hasStartedFilling (should stay true):', hasStartedFilling);
console.log('touched.travelModes:', touched.travelModes);  
console.log('checkHasStartedFilling result:', hasContentAfterUnselect);

// Check error display conditions
const errorExists = editForm.travelModes.length === 0 ? 'Select at least one travel mode.' : '';
console.log('\n4. ERROR DISPLAY CHECK:');
console.log('errorExists:', errorExists);
console.log('shouldShowError result:', shouldShowError(touched.travelModes, hasStartedFilling, errorExists));

console.log('\n5. THE PROBLEM:');
console.log('The hasStartedFilling logic checks travelModes.length > 0');
console.log('When all travel modes are unchecked, this condition becomes false');
console.log('But hasStartedFilling should STAY true once set (it should never go back to false)');
console.log('The current useEffect logic might not handle this correctly!');

console.log('\n=== DEBUG COMPLETE ===');