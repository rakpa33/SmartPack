// src/utils/itemQuantities.ts
// Utility for generating appropriate quantities for items

export interface ItemWithQuantity {
  baseItem: string;
  quantity: number | null;
  unit?: string;
}

export function addQuantityToItem(baseItem: string, tripLengthDays: number = 7): string {
  const item = baseItem.toLowerCase();
  
  // Define items that should have quantities based on trip length
  const quantityRules: Record<string, (days: number) => string> = {
    // Clothing quantities based on trip length
    'underwear': (days) => `${Math.min(days + 1, 10)} pairs of underwear`,
    'socks': (days) => `${Math.min(days + 1, 10)} pairs of socks`,
    'shirt': (days) => `${Math.ceil(days / 2)} shirts`,
    'shirts': (days) => `${Math.ceil(days / 2)} shirts`,
    't-shirt': (days) => `${Math.ceil(days / 2)} t-shirts`,
    't-shirts': (days) => `${Math.ceil(days / 2)} t-shirts`,
    'pants': (days) => `${Math.min(Math.ceil(days / 3), 4)} pairs of pants`,
    'jeans': (days) => `${Math.min(Math.ceil(days / 3), 3)} pairs of jeans`,
    
    // Health & toiletries with practical quantities
    'contact lens': (days) => `${days} contact lenses`,
    'contact lenses': (days) => `${days} contact lenses`,
    'medication': () => 'medication (enough for trip + extra)',
    'vitamins': () => 'vitamins (trip supply)',
    
    // Electronics with quantities
    'battery': () => '4-6 spare batteries',
    'batteries': () => '4-6 spare batteries',
    'phone charger': () => '1-2 phone chargers',
    'charger': () => '1-2 chargers',
    
    // Travel essentials
    'plastic bag': () => '3-5 plastic bags',
    'plastic bags': () => '3-5 plastic bags',
    'ziplock bag': () => '3-5 ziplock bags',
    'ziplock bags': () => '3-5 ziplock bags',
  };

  // Check if this item has a quantity rule
  for (const [pattern, rule] of Object.entries(quantityRules)) {
    if (item.includes(pattern)) {
      return rule(tripLengthDays);
    }
  }

  // Special handling for already numbered items
  if (/\d+/.test(baseItem)) {
    return baseItem; // Already has a quantity
  }

  // Default: return the item as-is
  return baseItem;
}

export function calculateTripLength(startDate: string, endDate: string): number {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays); // At least 1 day
  } catch {
    return 7; // Default to 7 days if dates are invalid
  }
}

export function enhanceItemsWithQuantities(
  items: Array<{ id: string; text: string; category: string; checked: boolean; aiGenerated: boolean }>,
  startDate?: string,
  endDate?: string
): Array<{ id: string; text: string; category: string; checked: boolean; aiGenerated: boolean }> {
  const tripLength = startDate && endDate ? calculateTripLength(startDate, endDate) : 7;
  
  return items.map(item => ({
    ...item,
    text: addQuantityToItem(item.text, tripLength)
  }));
}
