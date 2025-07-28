import { useContext } from 'react';
import { PackingListContext } from './PackingListContext';
import type { ChecklistItem, ChecklistCategory } from './PackingListContext';

export function usePackingList(): {
  items: ChecklistItem[];
  categories: ChecklistCategory[];
  addItem: (item: Omit<ChecklistItem, 'id'>) => void;
  editItem: (id: string, updates: Partial<Omit<ChecklistItem, 'id'>>) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  addCategory: (name: string) => void;
  editCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
  loadAiGeneratedItems: (items: Array<{ id: string; text: string; category: string; checked: boolean; aiGenerated: boolean }>) => void;
} {
  const ctx = useContext(PackingListContext);
  if (!ctx) throw new Error('usePackingList must be used within a PackingListProvider');
  return ctx;
}
