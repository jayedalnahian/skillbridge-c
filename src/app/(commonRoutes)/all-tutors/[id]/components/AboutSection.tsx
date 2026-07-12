"use client";

import { GraduationCap, Briefcase, Clock, Award, BookOpen, Globe } from "lucide-react";
import { ITutorWithRelations } from "@/types/tutor.types";
import { ICategory } from "@/types/category.types";
import { ScrollReveal } from "./ui/ScrollReveal";
import { GlassCard } from "./ui/GlassCard";

interface AboutSectionProps {
  tutor: ITutorWithRelations;
  categories: ICategory[];
}

export function AboutSection({ tutor, categories }: AboutSectionProps) {
  const credentials = [
    {
      icon: GraduationCap,
      label: "Education",
      value: tutor.educationLevel,
      color: "bg-primary/10 dark:bg-primary/20",
      iconColor: "text-primary",
    },
    {
      icon: Briefcase,
      label: "Experience",
      value: `${tutor.experienceYears} years of teaching`,
      color: "bg-emerald-500/10 dark:bg-emerald-500/20",
      iconColor: "text-emerald-500",
    },
    {
      icon: Clock,
      label: "Availability",
      value: `${tutor.availableDays?.slice(0, 3).join(", ")} · ${tutor.availabilityStartTime || "Flexible"}`,
      color: "bg-amber-500/10 dark:bg-amber-500/20",
      iconColor: "text-amber-500",
    },
    {
      icon: Award,
      label: "Rate",
      value: `$${tutor.hourlyRate}/hour`,
      color: "bg-purple-500/10 dark:bg-purple-500/20",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <ScrollReveal direction="up" delay={0.2}>
      <section className="space-y-8">
        {/* Bio / Philosophy */}
        <GlassCard className="p-6 sm:p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1 rounded-full bg-gradient-to-b from-primary to-accent" />
              <h2
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                About
              </h2>
            </div>

            <p className="text-base leading-relaxed text-muted-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {tutor.designation} with <span className="font-semibold text-foreground">{tutor.experienceYears} years</span> of professional teaching experience.
              Holds a degree in <span className="font-semibold text-foreground">{tutor.educationLevel}</span>
              {categories.length > 0 && (
                <> and specializes in <span className="font-semibold text-foreground">{categories.map((c) => c.name).join(", ")}</span></>
              )}
              . Dedicated to helping students build confidence and achieve mastery through personalized, one-on-one mentorship.
            </p>

            {/* Pull quote */}
            <div className="relative border-l-2 border-primary/40 pl-5 py-2">
              <p className="text-lg italic text-muted-foreground/80" style={{ fontFamily: "var(--font-dm-sans)" }}>
                &ldquo;Every student has the potential to excel — my role is to unlock that potential through clarity, patience, and structure.&rdquo;
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Credentials grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {credentials.map((cred, idx) => (
            <ScrollReveal key={idx} direction="up" delay={0.1 * idx}>
              <GlassCard className="group p-5 hoverable">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${cred.color} ring-1 ring-border`}>
                    <cred.icon className={`h-5 w-5 ${cred.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {cred.label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {cred.value}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Specialties */}
        {categories.length > 0 && (
          <ScrollReveal direction="up" delay={0.4}>
            <GlassCard className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="h-6 w-1 rounded-full bg-gradient-to-b from-accent to-orange-500" />
                <h2
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-syne)" }}
                >
                  Specialties
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <span
                    key={category.id}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {category.name}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" />
                  Online Tutoring
                </span>
              </div>
            </GlassCard>
          </ScrollReveal>
        )}
      </section>
    </ScrollReveal>
  );
}
