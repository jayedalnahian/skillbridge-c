"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  Clock,
  DollarSign,
  GraduationCap,
  BookOpen,
  User,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ITutorWithRelations } from "@/types/tutor.types";
import { ICategory } from "@/types/category.types";
import { IReview } from "@/types/review.types";
import { format } from "date-fns";
import { BookingModal } from "./BookingModal";

interface TutorDetailProps {
  tutor: ITutorWithRelations;
  categories: ICategory[];
  reviews: IReview[];
}

export function TutorDetail({ tutor, categories, reviews }: TutorDetailProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const profileImage = tutor.profilePhoto || tutor.User?.image;
  const displayName = tutor.name || tutor.User?.name || "Unknown Tutor";
  const averageRating = tutor.avgRating || 0;
  const reviewCount = reviews.length;

  // Format availability time
  const formatTime = (time: string | Date) => {
    if (!time) return "N/A";
    try {
      return format(new Date(time), "h:mm a");
    } catch {
      return String(time);
    }
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/all-tutors"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-[#00ADB5] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Tutors
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative h-64 w-full bg-gradient-to-br from-[#00ADB5]/10 via-[#00ADB5]/5 to-slate-100">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-slate-200">
                      <User className="h-16 w-16 text-slate-400" />
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2">
                    {renderStars(averageRating)}
                    <span className="text-white font-medium">{averageRating.toFixed(1)}</span>
                    <span className="text-white/80 text-sm">({reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
                    <p className="text-lg text-[#00ADB5] font-medium">{tutor.designation}</p>
                  </div>
                  {tutor.status === "ACTIVE" && (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                      Available
                    </Badge>
                  )}
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="bg-[#00ADB5]/10 text-[#008f96] hover:bg-[#00ADB5]/20"
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <GraduationCap className="h-5 w-5 text-[#00ADB5]" />
                    <div>
                      <p className="text-xs text-muted-foreground">Education</p>
                      <p className="text-sm font-medium line-clamp-1">{tutor.educationLevel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <Clock className="h-5 w-5 text-[#00ADB5]" />
                    <div>
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="text-sm font-medium">{tutor.experienceYears} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-[#00ADB5]" />
                    <div>
                      <p className="text-xs text-muted-foreground">Hourly Rate</p>
                      <p className="text-sm font-medium">${tutor.hourlyRate}/hr</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-[#00ADB5]" />
                    <div>
                      <p className="text-xs text-muted-foreground">Subjects</p>
                      <p className="text-sm font-medium">{categories.length} categories</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageSquare className="h-5 w-5 text-[#00ADB5]" />
                  Reviews ({reviewCount})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p>No reviews yet</p>
                    <p className="text-sm">Be the first to review this tutor!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.Student?.User?.profileImage || undefined}
                              alt={review.Student?.User?.name || "Student"}
                            />
                            <AvatarFallback className="bg-[#00ADB5]/10 text-[#00ADB5]">
                              {getInitials(review.Student?.User?.name || "S")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm">
                                {review.Student?.User?.name || "Anonymous"}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(review.createdAt), "MMM d, yyyy")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm font-medium ml-1">{review.rating}</span>
                            </div>
                            <p className="text-sm text-slate-700 mt-2">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact & Booking Card */}
            <Card className="border-0 shadow-lg sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Contact & Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  {tutor.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                        <Mail className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="text-slate-600">{tutor.email}</span>
                    </div>
                  )}
                  {tutor.contactNumber && (
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                        <Phone className="h-4 w-4 text-slate-600" />
                      </div>
                      <span className="text-slate-600">{tutor.contactNumber}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Availability */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-slate-900">Availability</h4>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                      <Clock className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-600">
                        {formatTime(tutor.availabilityStartTime)} - {formatTime(tutor.availabilityEndTime)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                      <Calendar className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-slate-600">
                        {tutor.availableDays?.join(", ") || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Book Button */}
                <Button 
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full bg-[#00ADB5] hover:bg-[#008f96] text-white h-12 text-base"
                >
                  Book a Session
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free cancellation up to 24 hours before the session
                </p>
              </CardContent>
            </Card>

            {/* Booking Modal */}
            <BookingModal
              isOpen={isBookingModalOpen}
              onClose={() => setIsBookingModalOpen(false)}
              tutor={tutor}
            />

            {/* Additional Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span className="font-medium">
                    {format(new Date(tutor.createdAt), "MMM yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="font-medium">
                    {format(new Date(tutor.updatedAt), "MMM d, yyyy")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
