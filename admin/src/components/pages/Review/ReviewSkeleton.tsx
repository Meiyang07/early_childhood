// src/pages/reviews/ReviewsSkeleton.tsx
export function ReviewsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="reviews-grid" aria-busy="true" aria-live="polite">
      {Array.from({ length: count }, (_, i) => (
        <div className="review-card review-card--skeleton" key={i}>
          <div className="sk sk-line sk-line--short" />
          <div className="sk sk-block" />
          <div className="sk sk-block" />
          <div className="sk sk-line sk-line--short" />
        </div>
      ))}
    </div>
  );
}