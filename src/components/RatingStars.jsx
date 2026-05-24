import { Star } from 'lucide-react';

export function RatingStars({ count = 5 }) {
  return (
    <span className="rating-stars" aria-label={`${count} star rating`}>
      {Array.from({ length: count }).map((_, index) => (
        <Star key={index} size={16} fill="currentColor" strokeWidth={0} />
      ))}
    </span>
  );
}
