import React, { useState, useEffect } from 'react';
import { usePackingList } from '../hooks/usePackingList';
import { ChecklistItem } from './ChecklistItem';
import { useTripForm } from '../hooks/useTripForm';

export const PackingList: React.FC = () => {
  const { items, categories, addItem, toggleItem, removeItem, loadAiGeneratedItems } = usePackingList();
  const { state } = useTripForm();
  const [newItem, setNewItem] = useState<{ [catId: string]: string }>({});

  // Load AI-generated items when they become available
  useEffect(() => {
    if (state.generatedPackingList?.checklist) {
      console.log('Loading AI-generated items:', state.generatedPackingList.checklist);
      loadAiGeneratedItems(state.generatedPackingList.checklist);
    }
  }, [state.generatedPackingList, loadAiGeneratedItems]);

  return (
    <>
      <h2 className="font-bold text-xl mb-4" role="heading" aria-level={2}>
        Packing Checklist
      </h2>
      {state.generatedPackingList && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ✨ AI has generated personalized suggestions based on your trip details and weather forecast.
            Items marked with <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.5 rounded text-xs">AI</span> are automatically suggested.
          </p>
        </div>
      )}
      <div className="space-y-6">
        {categories.map((cat: { id: string; name: string }) => (
          <div key={cat.id} className="mb-4">
            <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
            <ul className="space-y-2">
              {items.filter(item => item.category === cat.id).map(item => (
                <ChecklistItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  checked={item.checked}
                  aiGenerated={item.aiGenerated}
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
