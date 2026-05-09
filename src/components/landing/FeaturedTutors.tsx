"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, BadgeCheck, Clock, ArrowRight } from "lucide-react";

const featuredTutors = [
  {
    id: "1",
    name: "Dr. Sarah Mitchell",
    avatar: "SM",
    subject: "Mathematics",
    rating: 4.9,
    reviews: 127,
    hourlyRate: 45,
    experience: "8 years",
    bio: "PhD in Applied Mathematics. Specializes in Calculus, Linear Algebra, and Statistics.",
    tags: ["Calculus", "Statistics"],
    isVerified: true,
  },
  {
    id: "2",
    name: "James Chen",
    avatar: "JC",
    subject: "Programming",
    rating: 5.0,
    reviews: 203,
    hourlyRate: 60,
    experience: "10 years",
    bio: "Senior Software Engineer at Google. Expert in React, Node.js, and System Design.",
    tags: ["React", "Node.js"],
    isVerified: true,
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    avatar: "ER",
    subject: "Design",
    rating: 4.8,
    reviews: 89,
    hourlyRate: 55,
    experience: "6 years",
    bio: "Lead UX Designer at Apple. Passionate about user-centered design and prototyping.",
    tags: ["UI/UX", "Figma"],
    isVerified: true,
  },
  {
    id: "4",
    name: "Michael Park",
    avatar: "MP",
    subject: "Business",
    rating: 4.9,
    reviews: 156,
    hourlyRate: 50,
    experience: "12 years",
    bio: "MBA from Harvard. Former McKinsey consultant. Expert in marketing and strategy.",
    tags: ["Marketing", "Strategy"],
    isVerified: true,
  },
];

export function FeaturedTutors() {
  return (
    <section id="tutors" className="py-20 lg:py-28 bg-[#222831]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div className="max-w-2xl mb-8 lg:mb-0">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] text-sm font-medium mb-4">
              Top Rated
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-4">
              Featured Tutors
            </h2>
            <p className="text-lg text-[#EEEEEE]/70">
              Learn from the best. Our top-rated tutors are verified experts with proven track records.
            </p>
          </div>
          <Link href="/all-tutors">
            <Button
              variant="outline"
              className="border-[#00ADB5] text-[#EEEEEE] hover:bg-[#00ADB5]/10"
            >
              View all tutors
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Tutors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTutors.map((tutor) => (
            <Link
              key={tutor.id}
              href={`/all-tutors/${tutor.id}`}
              className="group p-6 rounded-2xl bg-[#393E46]/30 border border-[#393E46] hover:border-[#00ADB5]/50 transition-all duration-300 hover:bg-[#393E46]/50"
            >
              {/* Header with Avatar */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#00ADB5]/50 flex items-center justify-center text-[#222831] font-bold">
                    {tutor.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-[#EEEEEE]">
                        {tutor.name}
                      </h3>
                      {tutor.isVerified && (
                        <BadgeCheck className="h-4 w-4 text-[#00ADB5] fill-[#00ADB5]" />
                      )}
                    </div>
                    <p className="text-sm text-[#EEEEEE]/60">{tutor.subject}</p>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-[#00ADB5] fill-[#00ADB5]" />
                  <span className="text-sm font-medium text-[#EEEEEE]">
                    {tutor.rating}
                  </span>
                </div>
                <span className="text-sm text-[#EEEEEE]/50">
                  ({tutor.reviews} reviews)
                </span>
              </div>

              {/* Bio */}
              <p className="text-sm text-[#EEEEEE]/70 mb-4 line-clamp-2">
                {tutor.bio}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {tutor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs rounded-md bg-[#00ADB5]/10 text-[#00ADB5]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-[#393E46]">
                <div className="flex items-center gap-1 text-sm text-[#EEEEEE]/60">
                  <Clock className="h-4 w-4 text-[#00ADB5]" />
                  {tutor.experience}
                </div>
                <div className="text-[#00ADB5] font-semibold">
                  ${tutor.hourlyRate}/hr
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
