import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Trash2, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const MAX_SIZE_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

type ImagePickerProps = {
  value: File | null;
  onChange: (file: File | null) => void;
  existingUrl?: string;      // existing image (when editing)
  shape?: 'circle' | 'rounded';
  label?: string;
  hint?: string;
  error?: string;
};

export function ImagePicker({
  value,
  onChange,
  existingUrl,
  shape = 'circle',
  label = 'Profile photo',
  hint = 'JPG, PNG · max 5 MB',
  error,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState('');

  // Build preview: prefer the new file, fall back to existing URL
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const displayUrl = preview ?? existingUrl ?? null;

  const validateAndSet = useCallback(
    (file: File | null) => {
      setLocalError('');
      if (!file) {
        onChange(null);
        return;
      }
      if (!ACCEPTED.includes(file.type)) {
        setLocalError('Use JPG, PNG, WEBP or GIF.');
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`Image must be under ${MAX_SIZE_MB} MB.`);
        return;
      }
      onChange(file);
    },
    [onChange],
  );

  const shownError = error || localError;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-foreground">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {/* Avatar / drop zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            validateAndSet(e.dataTransfer.files?.[0] ?? null);
          }}
          className={cn(
            'group relative grid shrink-0 cursor-pointer place-items-center overflow-hidden',
            'border border-input bg-muted/40',
            'transition-all duration-200',
            'hover:border-primary/60 hover:bg-primary/5',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            shape === 'circle'
              ? 'size-24 rounded-full'
              : 'aspect-video w-full rounded-xl',
            dragging && 'border-primary bg-primary/10',
            shownError && 'border-destructive',
          )}
        >
          {displayUrl ? (
            <img
              src={displayUrl}
              alt="Preview"
              className="size-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              <User size={22} />
              <span className="text-[10px] font-medium">Upload</span>
            </div>
          )}

          {/* Hover overlay */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0 grid place-items-center',
              'bg-black/50 text-white',
              'opacity-0 transition-opacity duration-200',
              'group-hover:opacity-100 group-focus-visible:opacity-100',
              dragging && 'opacity-100',
            )}
          >
            <Camera size={18} />
          </div>
        </div>

        {/* Meta + actions */}
        <div className="flex min-w-0 flex-col gap-2">
          <p className="text-xs text-muted-foreground">{hint}</p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <Upload size={14} />
              {displayUrl ? 'Replace' : 'Upload'}
            </Button>

            {value && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => validateAndSet(null)}
              >
                <Trash2 size={14} />
                Remove
              </Button>
            )}

            {value && (
              <span className="text-xs tabular-nums text-muted-foreground">
                {(value.size / 1024).toFixed(0)} KB
              </span>
            )}
          </div>

          {shownError && (
            <p className="text-xs font-medium text-destructive" role="alert">
              {shownError}
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        hidden
        onChange={(e) => {
          validateAndSet(e.target.files?.[0] ?? null);
          e.target.value = '';
        }}
      />
    </div>
  );
}