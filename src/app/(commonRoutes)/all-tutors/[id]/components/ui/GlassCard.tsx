"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className,
  as: Tag = "div",
  hoverable = false,
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-border bg-gradient-to-b from-card to-card/80 backdrop-blur-xl shadow-xl shadow-black/10 dark:shadow-black/30",
        hoverable &&
          "transition-all duration-500 hover:border-border/50 hover:shadow-2xl hover:shadow-black/20 dark:hover:shadow-black/40 hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Tag>
  );
}
