import React, { useState, useEffect } from 'react';
import { usePackingList } from '../hooks/usePackingList';
import { ChecklistItem } from './ChecklistItem';
import { useTripForm } from '../hooks/useTripForm';
import { PlusIcon } from '@heroicons/react/24/solid';

export const PackingList: React.FC = () => {
  const { items, categories, addItem, toggleItem, removeItem, loadAiGeneratedItems } = usePackingList();
  const { state } = useTripForm();
  const [smartAddItem, setSmartAddItem] = useState('');

  // Smart categorization function
  const categorizeItem = (itemText: string): string => {
    const text = itemText.toLowerCase();

    // Clothing keywords
    if (/shirt|pants|dress|jacket|coat|sweater|underwear|socks|t-shirt|jeans|blouse|skirt|suit|tie|blazer|cardigan|hoodie|shorts/.test(text)) {
      return 'clothing';
    }

    // Footwear keywords
    if (/shoes|boots|sandals|sneakers|heels|flats|slippers|flip-flops/.test(text)) {
      return 'footwear';
    }

    // Electronics keywords
    if (/phone|charger|laptop|camera|headphones|power bank|adapter|cable|tablet|kindle|speaker/.test(text)) {
      return 'electronics';
    }

    // Health & hygiene keywords
    if (/toothbrush|shampoo|soap|medication|sunscreen|lotion|deodorant|perfume|cologne|vitamins|first aid/.test(text)) {
      return 'health';
    }

    // Documents keywords
    if (/passport|id|license|ticket|reservation|insurance|visa|card|cash|wallet/.test(text)) {
      return 'documents';
    }

    // Accessories keywords
    if (/hat|sunglasses|watch|jewelry|belt|scarf|gloves|bag|purse|backpack|umbrella/.test(text)) {
      return 'accessories';
    }

    // Toiletries keywords
    if (/toothpaste|shampoo|conditioner|body wash|face wash|moisturizer|razor|shaving cream/.test(text)) {
      return 'toiletries';
    }

    // Default to other if no specific category found
    return 'other';
  };

  // Handle smart add
  const handleSmartAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (smartAddItem.trim()) {
      const categoryId = categorizeItem(smartAddItem);
      addItem({
        label: smartAddItem.trim(),
        checked: false,
        category: categoryId,
        aiGenerated: false
      });
      setSmartAddItem('');
    }
  };

  // Load AI-generated items when they become available
  useEffect(() => {
    if (state.generatedPackingList?.checklist) {
      console.log('Loading AI-generated items:', state.generatedPackingList.checklist);
      loadAiGeneratedItems(state.generatedPackingList.checklist);
    }
  }, [state.generatedPackingList]);

  // Show only categories that have items (filter out empty categories)
  // This provides cleaner UX by hiding empty category sections
  const displayCategories = categories.filter(cat =>
    items.some(item => item.category === cat.id)
  );

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

      {/* Smart Add Input */}
      <div className="mb-6">
        <form onSubmit={handleSmartAdd} className="flex gap-2">
          <input
            type="text"
            value={smartAddItem}
            onChange={(e) => setSmartAddItem(e.target.value)}
            placeholder="Add any item (it will be automatically categorized)"
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={!smartAddItem.trim()}
          >
            <PlusIcon className="h-4 w-4" />
            Add
          </button>
        </form>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Items will be automatically sorted into the right category
        </p>
      </div>

      <div className="space-y-6">
        {displayCategories.map((cat: { id: string; name: string }) => (
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
          </div>
        ))}
      </div>
    </>
  );
};
