"use client";

import { cn } from "@/lib/utils";

interface BackgroundEffectsProps {
  className?: string;
  variant?: "default" | "hero" | "sidebar";
}

export function BackgroundEffects({
  className,
  variant = "default",
}: BackgroundEffectsProps) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      {/* Deep base gradient - theme aware */}
      <div className="absolute inset-0 bg-background" />

      {/* Mesh gradients */}
      {variant === "hero" && (
        <>
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-accent/10 via-transparent to-transparent blur-3xl" />
          <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-gradient-to-r from-primary/8 to-transparent blur-3xl" />
        </>
      )}

      {variant === "default" && (
        <>
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-gradient-to-bl from-primary/8 via-transparent to-transparent blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-accent/5 via-transparent to-transparent blur-3xl" />
        </>
      )}

      {variant === "sidebar" && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 blur-2xl" />
      )}

      {/* Subtle grid - border based */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Grain texture */}
      <div
        className="absolute inset-0 animate-grain opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E\")",
          backgroundSize: "256px 256px",
        }}
      />

      {/* Vignette - theme aware */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,black_100%)] opacity-40 dark:opacity-60" />
    </div>
  );
}
