import React from 'react';

interface ChecklistItemProps {
  id: string;
  label: string;
  checked: boolean;
  onToggle: () => void;
  // Placeholders for future edit/remove
  onEdit?: () => void;
  onRemove?: () => void;
}

export const ChecklistItem: React.FC<ChecklistItemProps> = ({ id, label, checked, onToggle, onRemove }) => {
  return (
    <li className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="form-checkbox"
        id={`checklist-item-${id}`}
      />
      <span className={checked ? 'line-through text-gray-400' : ''}>{label}</span>
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
