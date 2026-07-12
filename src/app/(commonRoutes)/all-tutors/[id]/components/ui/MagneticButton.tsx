"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}

export function MagneticButton({
  children,
  className,
  onClick,
  disabled = false,
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={cn(
        "relative overflow-hidden rounded-xl font-semibold transition-all duration-300",
        "bg-primary text-primary-foreground",
        "shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30",
        "hover:bg-primary/90",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none",
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <motion.div
        className="absolute inset-0 -z-0 rounded-xl bg-gradient-to-r from-primary/30 to-accent/30 opacity-0 transition-opacity duration-500"
        whileHover={{ opacity: 1 }}
      />
    </motion.button>
  );
}
