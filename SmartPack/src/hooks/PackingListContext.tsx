import { createContext } from 'react';

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  category: string;
}

export interface ChecklistCategory {
  id: string;
  name: string;
}

export interface PackingListContextType {
  items: ChecklistItem[];
  categories: ChecklistCategory[];
  addItem: (item: Omit<ChecklistItem, 'id'>) => void;
  editItem: (id: string, updates: Partial<Omit<ChecklistItem, 'id'>>) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  addCategory: (name: string) => void;
  editCategory: (id: string, name: string) => void;
  removeCategory: (id: string) => void;
}

export const PackingListContext = createContext<PackingListContextType | undefined>(undefined);
