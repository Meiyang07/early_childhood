import { useState } from 'react';
import { cn } from '@/lib/utils';

type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

interface ImageProps {
  src: string;
  alt: string;
  /** Fixed width in px (optional). */
  width?: number;
  /** Fixed height in px (optional). */
  height?: number;
  /** CSS aspect ratio, e.g. "16/9", "4/3", "1/1". Overrides height when set. */
  aspectRatio?: string;
  /** How the image fills its box. Default: 'cover'. */
  fit?: ImageFit;
  /** Responsive sizes hint for the browser. */
  sizes?: string;
  /** Loading strategy. Use `priority` for above-the-fold hero images. */
  priority?: boolean;
  /** Skip lazy loading (alias for priority). */
  eager?: boolean;
  /** Blur-up placeholder shown while loading. */
  placeholder?: 'blur' | 'empty';
  /** Fallback image src if the main one fails. */
  fallbackSrc?: string;
  /** Extra classes applied to the wrapper (for positioning, rounded corners, etc.). */
  className?: string;
  /** Extra classes applied to the `<img>` itself. */
  imgClassName?: string;
  /** object-position, e.g. "center 35%". */
  objectPosition?: string;
  /** Callback on load. */
  onLoad?: () => void;
  /** Callback on error. */
  onError?: () => void;
}

export function Image({
  src,
  alt,
  width,
  height,
  aspectRatio,
  fit = 'cover',
  sizes = '100vw',
  priority = false,
  eager = false,
  placeholder = 'empty',
  fallbackSrc,
  className,
  imgClassName,
  objectPosition,
  onLoad,
  onError,
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const isPriority = priority || eager;

  const finalSrc = errored && fallbackSrc ? fallbackSrc : src;

  const objectFitClass: Record<ImageFit, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down',
  };

  return (
    <span
      className={cn(
        'relative block overflow-hidden',
        aspectRatio && 'w-full',
        className,
      )}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {placeholder === 'blur' && !loaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gray-200 animate-pulse"
        />
      )}

      <img
        src={finalSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={isPriority ? 'eager' : 'lazy'}
        decoding={isPriority ? 'sync' : 'async'}
        fetchPriority={isPriority ? 'high' : 'auto'}
        draggable={false}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        onError={() => {
          if (!errored && fallbackSrc) {
            setErrored(true);
            return;
          }
          onError?.();
        }}
        style={{
          objectPosition,
        }}
        className={cn(
          'h-full w-full transition-opacity duration-500',
          objectFitClass[fit],
          loaded ? 'opacity-100' : 'opacity-0',
          imgClassName,
        )}
      />
    </span>
  );
}