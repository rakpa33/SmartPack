/**
 * Item Quantities Utility Tests
 * 
 * PURPOSE: Test the enhanced quantity logic to ensure Pattern 6 fix works correctly
 * 
 * PATTERN 6 FIX VALIDATION:
 * - Items with existing quantities should be preserved
 * - Items without quantities should get appropriate trip-based quantities
 * - Mock data should not be overwritten by enhancement logic
 */

import { describe, it, expect } from 'vitest';
import { addQuantityToItem, enhanceItemsWithQuantities } from '../../utils/itemQuantities';

describe('itemQuantities utility - Pattern 6 Fix Validation', () => {
  describe('addQuantityToItem', () => {
    it('should preserve existing quantities (Pattern 6 fix)', () => {
      // Mock data with existing quantities should be preserved
      expect(addQuantityToItem('6 pairs underwear', 4)).toBe('6 pairs underwear');
      expect(addQuantityToItem('MOCK: 6 pairs underwear', 4)).toBe('MOCK: 6 pairs underwear');
      expect(addQuantityToItem('3 shirts', 7)).toBe('3 shirts');
      expect(addQuantityToItem('10 pairs socks', 5)).toBe('10 pairs socks');
      
      // Items with numbers should be preserved even if they don't match patterns
      expect(addQuantityToItem('Room 123 key', 4)).toBe('Room 123 key');
      expect(addQuantityToItem('Flight 456 ticket', 4)).toBe('Flight 456 ticket');
    });

    it('should add quantities to items without numbers', () => {
      // Items without quantities should get calculated quantities
      expect(addQuantityToItem('underwear', 4)).toBe('5 pairs of underwear');  // 4 days + 1 = 5
      expect(addQuantityToItem('socks', 4)).toBe('5 pairs of socks');
      expect(addQuantityToItem('shirts', 7)).toBe('4 shirts');  // ceil(7/2) = 4
      expect(addQuantityToItem('pants', 9)).toBe('3 pairs of pants');  // ceil(9/3) = 3
    });

    it('should return items as-is if no quantity rules apply', () => {
      expect(addQuantityToItem('passport', 7)).toBe('passport');
      expect(addQuantityToItem('sunglasses', 4)).toBe('sunglasses');
      expect(addQuantityToItem('camera', 10)).toBe('camera');
    });
  });

  describe('enhanceItemsWithQuantities', () => {
    it('should preserve mock data quantities (Pattern 6 fix)', () => {
      const mockItems = [
        { id: '1', text: '6 pairs underwear', category: 'clothing', checked: false, aiGenerated: true },
        { id: '2', text: 'MOCK: Test item with 3 socks', category: 'clothing', checked: false, aiGenerated: true },
        { id: '3', text: 'underwear', category: 'clothing', checked: false, aiGenerated: true }
      ];

      const enhanced = enhanceItemsWithQuantities(mockItems, '2025-08-01', '2025-08-04'); // 3 days
      
      // Items with existing quantities should be preserved
      expect(enhanced[0].text).toBe('6 pairs underwear');
      expect(enhanced[1].text).toBe('MOCK: Test item with 3 socks');
      
      // Items without quantities should get calculated quantities  
      expect(enhanced[2].text).toBe('4 pairs of underwear'); // 3 days + 1 = 4
    });

    it('should handle missing dates gracefully', () => {
      const items = [
        { id: '1', text: 'underwear', category: 'clothing', checked: false, aiGenerated: true }
      ];

      const enhanced = enhanceItemsWithQuantities(items); // No dates provided
      
      // Should use default 7 days: 7 + 1 = 8 pairs
      expect(enhanced[0].text).toBe('8 pairs of underwear');
    });

    it('should preserve all other item properties', () => {
      const items = [
        { id: '1', text: '6 pairs underwear', category: 'clothing', checked: true, aiGenerated: false }
      ];

      const enhanced = enhanceItemsWithQuantities(items, '2025-08-01', '2025-08-04');
      
      expect(enhanced[0]).toEqual({
        id: '1',
        text: '6 pairs underwear', // Preserved
        category: 'clothing',
        checked: true,
        aiGenerated: false
      });
    });
  });
});
