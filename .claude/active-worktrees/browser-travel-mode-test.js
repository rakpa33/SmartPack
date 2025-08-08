// Browser Test Script for Travel Mode Validation
// This script tests the exact user scenario in the browser

console.log('=== BROWSER TRAVEL MODE VALIDATION TEST ===');

// Wait for page to load
setTimeout(() => {
  console.log('Starting browser test...');
  
  // Find the Train checkbox
  const trainCheckbox = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    .find(cb => cb.parentElement.textContent.trim() === 'Train');
  
  if (!trainCheckbox) {
    console.error('❌ Train checkbox not found!');
    return;
  }
  
  console.log('✅ Train checkbox found:', trainCheckbox);
  
  // Find the error display area
  const errorArea = document.querySelector('.text-error');
  console.log('Current error area:', errorArea ? errorArea.textContent : 'No error area found');
  
  // Step 1: Click Train to select it
  console.log('\n1. SELECTING TRAIN...');
  trainCheckbox.click();
  console.log('Train checked:', trainCheckbox.checked);
  
  setTimeout(() => {
    // Step 2: Click Train again to unselect it
    console.log('\n2. UNSELECTING TRAIN...');
    trainCheckbox.click();
    console.log('Train checked after unselect:', trainCheckbox.checked);
    
    setTimeout(() => {
      // Step 3: Check if error appears
      console.log('\n3. CHECKING FOR ERROR...');
      const errorElement = document.querySelector('.text-error');
      console.log('Error element found:', !!errorElement);
      
      if (errorElement) {
        console.log('✅ Error message displayed:', errorElement.textContent);
      } else {
        console.log('❌ NO ERROR MESSAGE DISPLAYED - This is the bug!');
        
        // Debug the state
        console.log('\nDEBUGGING STATE...');
        
        // Check if travel mode section exists
        const travelModeSection = document.querySelector('label').parentElement;
        console.log('Travel mode section HTML:', travelModeSection ? travelModeSection.innerHTML : 'Not found');
        
        // Check all checkboxes
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        console.log('All checkboxes:', Array.from(allCheckboxes).map(cb => ({
          text: cb.parentElement.textContent.trim(),
          checked: cb.checked
        })));
        
        // Check for any error divs
        const allErrorDivs = document.querySelectorAll('div');
        const errorDivs = Array.from(allErrorDivs).filter(div => 
          div.className.includes('text-error') || 
          div.textContent.includes('travel mode') ||
          div.textContent.includes('Select at least')
        );
        console.log('Potential error divs:', errorDivs.map(div => ({
          className: div.className,
          textContent: div.textContent,
          style: div.style.display
        })));
      }
      
      console.log('\n=== BROWSER TEST COMPLETE ===');
    }, 100);
  }, 100);
}, 1000);

// Also log any console errors
window.addEventListener('error', (e) => {
  console.error('Browser error:', e.error);
});

console.log('Browser test script loaded. Test will start in 1 second...');