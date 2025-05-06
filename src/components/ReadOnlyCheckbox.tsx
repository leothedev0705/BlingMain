import React from 'react';
import { usePermissions } from '@/lib/usePermissions';

interface ReadOnlyCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
  label?: string;
}

/**
 * ReadOnlyCheckbox component
 * 
 * A wrapper around checkbox elements that enforces read-only mode for user role
 * This component will make the checkbox completely unclickable for users while allowing
 * admins to toggle as normal
 */
export default function ReadOnlyCheckbox({
  checked,
  onChange,
  className,
  id,
  label,
  ...props
}: ReadOnlyCheckboxProps) {
  const { userRole } = usePermissions();
  
  // Base styling for checkboxes
  const baseStyles = `h-4 w-4 text-gold focus:ring-gold border-gray-300 rounded ${
    userRole === 'user' ? 'bg-gray-100 cursor-not-allowed' : ''
  } ${className || ''}`;
  
  // Force read-only mode for users
  const isReadOnly = userRole === 'user';
  
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        className={baseStyles}
        checked={checked}
        onChange={onChange}
        id={id}
        disabled={isReadOnly}
        readOnly={isReadOnly}
        {...props}
      />
      {label && (
        <label htmlFor={id} className={`ml-2 block text-sm text-gray-700 ${isReadOnly ? 'cursor-not-allowed' : ''}`}>
          {label}
        </label>
      )}
    </div>
  );
} 