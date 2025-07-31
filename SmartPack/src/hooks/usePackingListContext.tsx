import { useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { PackingListContext } from './PackingListContext';
import type { ChecklistItem, ChecklistCategory } from './PackingListContext';
import { getDefaultCategories, createCategoryIfNotExists, mergeAndCleanupCategories } from '../utils/categoryUtils';

const LOCAL_STORAGE_KEY = 'smartpack_checklist';
const LOCAL_STORAGE_CATEGORIES_KEY = 'smartpack_categories';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const PackingListProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    const savedItems = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [categories, setCategories] = useState<ChecklistCategory[]>(
    () => {
      const savedCategories = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      return savedCategories ? JSON.parse(savedCategories) : getDefaultCategories();
    }
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const addItem = (item: Omit<ChecklistItem, 'id'>) => {
    // Auto-create category if it doesn't exist
    setCategories(prev => createCategoryIfNotExists(prev, item.category));
    setItems((prev) => [...prev, { ...item, id: generateId() }]);
  };
  const editItem = (id: string, updates: Partial<Omit<ChecklistItem, 'id'>>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };
  const removeItem = (id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((item) => item.id !== id);
      // Clean up categories after removing item
      setTimeout(() => {
        setCategories(currentCategories => mergeAndCleanupCategories(currentCategories, newItems));
      }, 0);
      return newItems;
    });
  };
  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };
  const addCategory = (name: string) => {
    setCategories((prev) => [...prev, { id: generateId(), name }]);
  };
  const editCategory = (id: string, name: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, name } : cat)));
  };
  const removeCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setItems((prev) => prev.map((item) => (item.category === id ? { ...item, category: 'other' } : item)));
  };

  const loadAiGeneratedItems = useCallback((aiItems: Array<{ id: string; text: string; category: string; checked: boolean; aiGenerated: boolean }>) => {
    // Clear existing AI-generated items
    setItems((prev) => prev.filter(item => !item.aiGenerated));

    // Transform API items to match our ChecklistItem interface and add them
    const newItems: ChecklistItem[] = aiItems.map(item => ({
      id: item.id,
      label: item.text,
      checked: item.checked,
      category: item.category.toLowerCase(),
      aiGenerated: true
    }));

    // Add AI-generated categories if they don't exist using the utility
    const newCategories = [...new Set(aiItems.map(item => item.category.toLowerCase()))];
    setCategories(prev => {
      let updatedCategories = prev;
      newCategories.forEach(categoryId => {
        updatedCategories = createCategoryIfNotExists(updatedCategories, categoryId);
      });
      return updatedCategories;
    });

    setItems((prev) => [...prev, ...newItems]);
  }, []);

  return (
    <PackingListContext.Provider value={{ items, categories, addItem, editItem, removeItem, toggleItem, addCategory, editCategory, removeCategory, loadAiGeneratedItems }}>
      {children}
    </PackingListContext.Provider>
  );
};
