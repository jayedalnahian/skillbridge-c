"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Clock, DollarSign, GraduationCap, BookOpen, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ITutorWithRelations } from "@/types/tutor.types";

interface TutorCardProps {
  tutor: ITutorWithRelations;
}

export function TutorCard({ tutor }: TutorCardProps) {
  const profileImage = tutor.profilePhoto || tutor.User?.image;
  const displayName = tutor.name || tutor.User?.name || "Unknown";
  const categories = tutor.tutorCategory?.map((tc) => tc.Category?.name).filter(Boolean) || [];

  return (
    <Card className="overflow-hidden border border-slate-200 shadow-md transition-all hover:shadow-xl hover:border-[#00ADB5]/30">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={displayName}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-300">
                <User className="h-10 w-10 text-slate-500" />
              </div>
            </div>
          )}
          {tutor.status === "ACTIVE" && (
            <Badge className="absolute right-3 top-3 bg-green-500 text-white">
              Available
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{displayName}</h3>
            <p className="text-sm text-muted-foreground">{tutor.designation}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 3).map((category, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
            {categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{categories.length - 3}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span className="line-clamp-1">{tutor.educationLevel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{tutor.experienceYears} years</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-4 w-4" />
              <span>${tutor.hourlyRate}/hr</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              <span className="line-clamp-1">{tutor.availableDays?.slice(0, 3).join(", ")}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 pt-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.8</span>
            <span className="text-sm text-muted-foreground">(24 reviews)</span>
          </div>

          <Link href={`/all-tutors/${tutor.id}`} className="block">
            <Button className="w-full bg-[#00ADB5] hover:bg-[#008f96] text-white">
              View Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
