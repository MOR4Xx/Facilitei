import { useState } from "react";
import { motion } from "framer-motion";

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

export function RatingInput({ rating, onRatingChange }: RatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoverRating || rating);
        return (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className={`text-4xl transition-colors duration-200 focus:outline-none ${
              isActive
                ? "text-accent drop-shadow-[0_0_5px_rgba(163,230,53,0.6)]"
                : "text-dark-subtle/20"
            }`}
          >
            ★
          </motion.button>
        );
      })}
    </div>
  );
}
