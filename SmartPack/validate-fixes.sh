#!/bin/bash
# Test Validation Script
# Run this to validate our systematic test fixes

echo "=== SmartPack Test Validation ==="
echo "Testing our systematic fixes following test-analysis.prompt.md methodology"
echo ""

echo "1. Testing localStorage (should pass)..."
npx vitest run src/__tests__/localStorage.test.ts --reporter=basic

echo ""
echo "2. Testing SuggestionsPanel unit tests (should pass all 9)..."
npx vitest run src/__tests__/SuggestionsPanel.test.tsx --reporter=basic

echo ""
echo "3. Testing SuggestionsPanel integration (should pass with our mock fixes)..."
npx vitest run src/__tests__/integration/SuggestionsPanel.integration.test.tsx --reporter=basic

echo ""
echo "4. Testing DarkModeToggle (control test - should pass)..."
npx vitest run src/__tests__/DarkModeToggle.test.tsx --reporter=basic

echo ""
echo "5. Testing API services (should pass)..."
npx vitest run src/__tests__/services/ --reporter=basic

echo ""
echo "=== Validation Complete ==="
echo "If all tests pass, our systematic analysis methodology was successful!"
