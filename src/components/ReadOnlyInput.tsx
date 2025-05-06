import React from 'react';
import { usePermissions } from '@/lib/usePermissions';

interface ReadOnlyInputProps {
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
  id?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string | number;
  isTextArea?: boolean;
}

/**
 * ReadOnlyInput component
 * 
 * A wrapper around input/textarea elements that enforces read-only mode for user role
 * This component will make the input completely uneditable for users while allowing
 * admins to edit as normal
 */
export default function ReadOnlyInput({
  type = 'text',
  value,
  onChange,
  className,
  rows,
  id,
  placeholder,
  min,
  max,
  step,
  isTextArea = false,
  ...props
}: ReadOnlyInputProps) {
  const { userRole } = usePermissions();
  
  // Base styling for inputs
  const baseStyles = `mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border ${
    userRole === 'user' ? 'bg-gray-100 cursor-not-allowed' : ''
  } ${className || ''}`;
  
  // Force read-only mode for users
  const isReadOnly = userRole === 'user';
  
  if (isTextArea) {
    return (
      <textarea
        className={baseStyles}
        value={value}
        onChange={onChange}
        rows={rows || 3}
        id={id}
        placeholder={placeholder}
        disabled={isReadOnly}
        readOnly={isReadOnly}
        {...props}
      />
    );
  }
  
  return (
    <input
      type={type}
      className={baseStyles}
      value={value}
      onChange={onChange}
      id={id}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      disabled={isReadOnly}
      readOnly={isReadOnly}
      {...props}
    />
  );
} 