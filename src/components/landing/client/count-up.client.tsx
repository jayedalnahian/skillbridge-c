"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLDivElement>(null);
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const hasDecimal = value.includes(".");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 2000;
          const step = 16;
          const totalSteps = duration / step;
          const increment = numericValue / totalSteps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
              setDisplayValue(hasDecimal ? "4.9" : value);
              clearInterval(timer);
            } else {
              setDisplayValue(
                hasDecimal
                  ? (start / 1000).toFixed(1)
                  : Math.floor(start).toString()
              );
            }
          }, step);

          observer.disconnect();
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [numericValue, value, hasDecimal]);

  return (
    <div ref={ref}>
      {displayValue}
      {suffix}
    </div>
  );
}
