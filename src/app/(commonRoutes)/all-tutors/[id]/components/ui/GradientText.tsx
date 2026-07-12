"use client";

import { cn } from "@/lib/utils";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p";
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  as: Tag = "span",
  animate = false,
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        "bg-gradient-to-r from-[#00D4C8] via-[#00E5BE] to-[#FF6B35] bg-clip-text text-transparent",
        animate && "animate-gradient-shift",
        className
      )}
    >
      {children}
    </Tag>
  );
}
