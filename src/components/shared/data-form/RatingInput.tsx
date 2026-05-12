"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  className?: string;
  starClassName?: string;
}

export function RatingInput({
  value,
  onChange,
  max = 5,
  className,
  starClassName,
}: RatingInputProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: max }).map((_, i) => {
        const starValue = i + 1;
        const isActive = starValue <= displayValue;

        return (
          <button
            key={i}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(null)}
            onClick={() => onChange(starValue)}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                isActive
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-300 fill-transparent",
                starClassName
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
