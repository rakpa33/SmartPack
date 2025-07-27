import React, { useState } from 'react';
import { usePackingList } from '../hooks/usePackingList';
import { ChecklistItem } from './ChecklistItem';

export const PackingList: React.FC = () => {
  const { items, categories, addItem, toggleItem, removeItem } = usePackingList();
  const [newItem, setNewItem] = useState<{ [catId: string]: string }>({});

  return (
    <>
      <h2 className="font-bold text-xl mb-4" role="heading" aria-level={2}>
        Packing Checklist
      </h2>
      <div className="space-y-6">
        {categories.map((cat: { id: string; name: string }) => (
          <div key={cat.id} className="mb-4">
            <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
            <ul className="space-y-2">
              {items.filter((item: { id: string; label: string; checked: boolean; category: string }) => item.category === cat.id).map((item: { id: string; label: string; checked: boolean; category: string }) => (
                <ChecklistItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={item.checked}
                  onToggle={() => toggleItem(item.id)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </ul>
            <form
              onSubmit={e => {
                e.preventDefault();
                if (newItem[cat.id]?.trim()) {
                  addItem({ label: newItem[cat.id], checked: false, category: cat.id });
                  setNewItem(prev => ({ ...prev, [cat.id]: '' }));
                }
              }}
              className="flex gap-2 mt-2"
            >
              <input
                type="text"
                value={newItem[cat.id] || ''}
                onChange={e => setNewItem(prev => ({ ...prev, [cat.id]: e.target.value }))}
                placeholder={`Add to ${cat.name}`}
                className="input input-bordered flex-1"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Add
              </button>
            </form>
          </div>
        ))}
      </div>
    </>
  );
};
