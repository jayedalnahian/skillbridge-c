"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, DollarSign, GraduationCap, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITutorWithRelations } from "@/types/tutor.types";

interface TutorCardProps {
  tutor: ITutorWithRelations;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const profileImage = tutor.profilePhoto || tutor.User?.image;
  console.log("TutorCard - tutor:", tutor);
  const displayName = tutor.name || tutor.User?.name || "Unknown";
  const categories = tutor.tutorCategory
    ?.map((tc) => tc.Category?.name)
    .filter(Boolean) || [];
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="group relative overflow-hidden border p-0 gap-0 ring-1 ring-border/50 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:ring-primary/30">
      {/* Hover glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(200px 200px at 50% -10%, hsl(var(--primary) / 0.08), transparent)",
        }}
      />

      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br from-primary/5 via-muted to-background">
        {profileImage ? (
          <>
            <Image
              src={profileImage}
              alt={displayName}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-primary/15 backdrop-blur-sm">
              <span className="text-lg font-bold text-primary">{initials}</span>
            </div>
          </div>
        )}

        {tutor.status === "ACTIVE" && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-background/70 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium leading-none text-green-500 ring-1 ring-green-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            Available
          </div>
        )}

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/70 backdrop-blur-md px-2.5 py-1 ring-1 ring-yellow-400/20">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-[11px] font-semibold leading-none text-yellow-500">
            {tutor.avgRating}
          </span>
        </div>
      </div>

      <CardContent className="p-4 pt-3">
        <div className="space-y-3">
          {/* Name + Designation */}
          <div>
            <h3 className="font-semibold text-base leading-tight tracking-tight text-card-foreground">
              {displayName}
            </h3>
            {tutor.designation && (
              <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground/70">
                {tutor.designation}
              </p>
            )}
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {categories.slice(0, 3).map((category, idx) => (
                <Badge
                  key={idx}
                  variant={idx === 0 ? "default" : "secondary"}
                  className="text-[10px] font-medium px-2 py-0.5 leading-none"
                >
                  {category}
                </Badge>
              ))}
              {categories.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-2 py-0.5 leading-none"
                >
                  +{categories.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{tutor.educationLevel || "—"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{tutor.experienceYears} yrs</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 shrink-0" />
              <span>${tutor.hourlyRate}/hr</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {tutor.availableDays?.slice(0, 3).join(", ") || "—"}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link href={`/all-tutors/${tutor.id}`} className="block pt-1">
            <Button className="h-10 w-full rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 sm:w-auto">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
