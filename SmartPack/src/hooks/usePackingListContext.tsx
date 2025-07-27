import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { PackingListContext } from './PackingListContext';
import type { ChecklistItem, ChecklistCategory } from './PackingListContext';

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
      return savedCategories ? JSON.parse(savedCategories) : [
        { id: 'clothing', name: 'Clothing' },
        { id: 'toiletries', name: 'Toiletries' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'other', name: 'Other' },
      ];
    }
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  }, [items]);
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  const addItem = (item: Omit<ChecklistItem, 'id'>) => {
    setItems((prev) => [...prev, { ...item, id: generateId() }]);
  };
  const editItem = (id: string, updates: Partial<Omit<ChecklistItem, 'id'>>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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

  return (
    <PackingListContext.Provider value={{ items, categories, addItem, editItem, removeItem, toggleItem, addCategory, editCategory, removeCategory }}>
      {children}
    </PackingListContext.Provider>
  );
};
