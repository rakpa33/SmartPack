import React from 'react';

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
  aiGenerated?: boolean;
  // Placeholders for future edit/remove
  onEdit?: () => void;
  onRemove?: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, label, checked, onToggle, aiGenerated, onRemove }) => {
  return (
    <li className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="form-checkbox"
        id={`checklist-item-${id}`}
      />
      <span className={`${checked ? 'line-through text-gray-400' : ''} ${aiGenerated ? 'flex items-center gap-1' : ''}`}>
        {label}
        {aiGenerated && (
          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.5 rounded" title="AI Generated">
            AI
          </span>
        )}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className="btn btn-sm btn-error"
        >
          Remove
        </button>
      )}
    </li>
  );
};
