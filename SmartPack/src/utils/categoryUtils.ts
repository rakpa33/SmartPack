// src/utils/categoryUtils.ts
// Utility functions for dynamic category management

import type { ChecklistItem, ChecklistCategory } from '../hooks/PackingListContext';

export function getRelevantCategoriesForItems(items: ChecklistItem[]): string[] {
  const categoriesInUse = new Set(items.map(item => item.category));
  return Array.from(categoriesInUse);
}

export function getDefaultCategories(): ChecklistCategory[] {
  return [
    { id: 'clothing', name: 'Clothing' },
    { id: 'toiletries', name: 'Toiletries' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'documents', name: 'Documents' },
    { id: 'health', name: 'Health & Medicine' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'footwear', name: 'Footwear' },
    { id: 'essentials', name: 'Essentials' },
    { id: 'other', name: 'Other' }
  ];
}

export function createCategoryIfNotExists(
  categories: ChecklistCategory[], 
  categoryId: string
): ChecklistCategory[] {
  if (categories.some(cat => cat.id === categoryId)) {
    return categories;
  }

  // Create a new category with proper name formatting
  const categoryName = formatCategoryName(categoryId);
  return [...categories, { id: categoryId, name: categoryName }];
}

export function formatCategoryName(categoryId: string): string {
  // Convert category IDs to proper display names
  const specialCases: Record<string, string> = {
    'health': 'Health & Medicine',
    'toiletries': 'Toiletries',
    'electronics': 'Electronics',
    'documents': 'Documents',
    'accessories': 'Accessories',
    'footwear': 'Footwear',
    'essentials': 'Essentials',
    'clothing': 'Clothing',
    'comfort': 'Comfort & Travel',
    'navigation': 'Navigation',
    'general': 'General',
    'other': 'Other'
  };

  if (specialCases[categoryId.toLowerCase()]) {
    return specialCases[categoryId.toLowerCase()];
  }

  // Default: capitalize first letter and handle underscores/hyphens
  return categoryId
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function mergeAndCleanupCategories(
  categories: ChecklistCategory[], 
  items: ChecklistItem[]
): ChecklistCategory[] {
  const itemCategories = getRelevantCategoriesForItems(items);
  
  // Remove categories that have no items
  const usedCategories = categories.filter(cat => itemCategories.includes(cat.id));
  
  // Add any missing categories that have items
  const existingCategoryIds = usedCategories.map(cat => cat.id);
  const missingCategories = itemCategories
    .filter(catId => !existingCategoryIds.includes(catId))
    .map(catId => ({ id: catId, name: formatCategoryName(catId) }));
  
  return [...usedCategories, ...missingCategories];
}

export function shouldRemoveEmptyCategory(
  category: ChecklistCategory, 
  items: ChecklistItem[]
): boolean {
  // Don't remove default categories even if empty
  const defaultCategoryIds = getDefaultCategories().map(cat => cat.id);
  if (defaultCategoryIds.includes(category.id)) {
    return false;
  }
  
  // Remove if no items in this category
  return !items.some(item => item.category === category.id);
}
