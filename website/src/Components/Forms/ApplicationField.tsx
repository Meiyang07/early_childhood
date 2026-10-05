import type { ReactNode } from 'react';
import type { ApplicationField as FieldName } from '@/types';

interface ApplicationFieldProps {
  name: FieldName;
  label: string;
  error?: string;
  children: ReactNode;
}

export function ApplicationField({ name, label, error, children }: ApplicationFieldProps) {
  const inputId = `application-${name}`;
  return (
    <div className="mb-8 last:mb-0">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-[15px] font-medium leading-tight md:text-[17px]"
      >
        {label}
      </label>
      {children}
      {error && (
        <small id={`${inputId}-error`} className="mt-1.5 block text-[13px] leading-snug text-[#a52530]">
          {error}
        </small>
      )}
    </div>
  );
}