"use client";

import { motion } from "framer-motion";
import { Star, GraduationCap, Clock, DollarSign, Users, BookOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ITutorWithRelations } from "@/types/tutor.types";
import { ICategory } from "@/types/category.types";
import { MagneticButton } from "./ui/MagneticButton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TutorHeroProps {
  tutor: ITutorWithRelations;
  categories: ICategory[];
  onBook: () => void;
}

export function TutorHero({ tutor, categories, onBook }: TutorHeroProps) {
  const displayName = tutor.name || tutor.User?.name || "Unknown Tutor";
  const profileImage = tutor.profilePhoto || tutor.User?.image;
  const averageRating = tutor.avgRating || 0;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
  };

  const photoVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0, 1] as const } },
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-muted/50 via-transparent to-transparent">
      {/* Hero background glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-accent/15 via-transparent to-transparent blur-3xl" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 grid gap-8 lg:grid-cols-[auto_1fr] lg:gap-12 p-6 sm:p-8 lg:p-12"
      >
        {/* Portrait */}
        <motion.div variants={photoVariants} className="relative mx-auto lg:mx-0">
          <div className="relative h-40 w-40 sm:h-48 sm:w-48 lg:h-56 lg:w-56">
            {/* Glow ring */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent blur-2xl" />
            {/* Ring */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary/50 via-primary/20 to-accent/20 p-[2px]">
              <div className="h-full w-full rounded-full bg-background" />
            </div>
            {/* Image */}
            <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-muted to-muted/50 ring-2 ring-border">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground/80" style={{ fontFamily: "var(--font-syne)" }}>
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Status badge */}
            {tutor.status === "ACTIVE" && (
              <div className="absolute -bottom-1 -right-1 flex items-center gap-1.5 rounded-full bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 text-[11px] font-medium leading-none text-green-500 shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                </span>
                Available
              </div>
            )}
          </div>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          {/* Name & Title */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              {displayName}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground font-light" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {tutor.designation}
            </p>
          </motion.div>

          {/* Rating */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-5 w-5",
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-foreground">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">·</span>
            <span className="text-sm text-muted-foreground">
              Based on tutoring experience
            </span>
          </motion.div>

          {/* Categories */}
          {categories.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  <BookOpen className="mr-1.5 h-3 w-3" />
                  {category.name}
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Stats grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4"
          >
            {[
              { icon: DollarSign, label: "Hourly Rate", value: `$${tutor.hourlyRate}/hr` },
              { icon: Clock, label: "Experience", value: `${tutor.experienceYears} years` },
              { icon: GraduationCap, label: "Education", value: tutor.educationLevel },
              { icon: MapPin, label: "Location", value: "Online" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-muted p-3.5 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-4 justify-center lg:justify-start " >
            <Button
              onClick={onBook}
              className="h-10 w-full rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
            >
              <Users className="h-5 w-5" />
              Book a Session
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}


// className="h-10 w-full rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
