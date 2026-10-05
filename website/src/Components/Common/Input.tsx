import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ────────────────────────────────────────────
 * Input
 * ──────────────────────────────────────────── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  /** Optional icon on the left side of the input */
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, className, id, name, ...rest },
  ref,
) {
  const inputId = id ?? `input-${name}`;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#435066]"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'w-full rounded-full border bg-white px-4 py-3 text-sm text-[#283247] outline-none transition',
            'placeholder:text-gray-400',
            'focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(40,60,130,0.11)]',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
            error
              ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]'
              : 'border-[#dbe1ea]',
            leftIcon ? 'pl-11' : undefined,
            className,
          )}
          {...rest}
        />
      </div>
      {error && (
        <small id={errorId} className="text-xs text-red-600">
          {error}
        </small>
      )}
      {!error && hint && (
        <small id={hintId} className="text-xs text-gray-500">
          {hint}
        </small>
      )}
    </div>
  );
});

/* ────────────────────────────────────────────
 * Textarea
 * ──────────────────────────────────────────── */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, hint, className, id, name, ...rest }, ref) {
    const inputId = id ?? `textarea-${name}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#435066]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={cn(
            'w-full resize-y rounded-[18px] border bg-white px-4 py-3 text-sm text-[#283247] outline-none transition',
            'placeholder:text-gray-400',
            'focus:border-brand-blue focus:shadow-[0_0_0_3px_rgba(40,60,130,0.11)]',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-60',
            error
              ? 'border-red-400 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.12)]'
              : 'border-[#dbe1ea]',
            className,
          )}
          {...rest}
        />
        {error && (
          <small id={errorId} className="text-xs text-red-600">
            {error}
          </small>
        )}
        {!error && hint && (
          <small id={hintId} className="text-xs text-gray-500">
            {hint}
          </small>
        )}
      </div>
    );
  },
);