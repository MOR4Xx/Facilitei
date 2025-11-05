import { useState } from 'react';

interface RatingFilterProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingFilter({ rating, onRatingChange }: RatingFilterProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <span
            key={star}
            className={`text-2xl transition-all duration-150 cursor-pointer ${
              isActive
                ? 'text-accent'
                : 'text-dark-subtle/50 hover:text-accent/70'
            }`}
            onClick={() => onRatingChange(star === rating ? 0 : star)} // Clicar de novo reseta
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}