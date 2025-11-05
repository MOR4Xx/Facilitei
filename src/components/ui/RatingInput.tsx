import { useState } from 'react';

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingInput({ rating, onRatingChange }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex space-x-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <span
            key={star}
            className={`text-4xl transition-all duration-150 cursor-pointer ${
              isActive
                ? 'text-accent scale-110'
                : 'text-dark-subtle/50 hover:text-accent/70'
            }`}
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            style={{ filter: isActive ? 'drop-shadow(0 0 5px var(--tw-color-accent))' : 'none' }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}