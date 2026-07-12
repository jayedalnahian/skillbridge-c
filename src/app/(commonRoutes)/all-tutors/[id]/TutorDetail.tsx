"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ITutorWithRelations } from "@/types/tutor.types";
import { ICategory } from "@/types/category.types";
import { IReview } from "@/types/review.types";

import { BackgroundEffects } from "./components/BackgroundEffects";
import { TutorHero } from "./components/TutorHero";
import { BookingSidebar } from "./components/BookingSidebar";
import { AboutSection } from "./components/AboutSection";
import { ReviewsSection } from "./components/ReviewsSection";
import { BookingModal } from "./components/BookingModal";

interface TutorDetailProps {
  tutor: ITutorWithRelations;
  categories: ICategory[];
  reviews: IReview[];
}

export function TutorDetail({ tutor, categories, reviews }: TutorDetailProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPrefill, setBookingPrefill] = useState<{
    date: Date;
    time: string;
    duration: number;
  } | null>(null);

  const handleBook = (date: Date, time: string, duration: number) => {
    setBookingPrefill({ date, time, duration });
    setIsBookingModalOpen(true);
  };

  const handleHeroBook = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundEffects variant="default" />

      {/* Top navigation */}
      <div className="relative z-20 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/all-tutors"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Tutors
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="space-y-10 lg:space-y-12">
          {/* Hero */}
          <TutorHero
            tutor={tutor}
            categories={categories}
            onBook={handleHeroBook}
          />

          {/* Content grid: About + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-10">
            <div className="space-y-10 min-w-0">
              <AboutSection tutor={tutor} categories={categories} />
              <ReviewsSection reviews={reviews} />
            </div>

            <div className="lg:block">
              <BookingSidebar tutor={tutor} onBook={handleBook} />
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setBookingPrefill(null);
        }}
        tutor={tutor}
        prefill={bookingPrefill}
      />
    </div>
  );
}
