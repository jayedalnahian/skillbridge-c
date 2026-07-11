

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, BadgeCheck, Clock, ArrowRight } from "lucide-react";
import { MotionDiv } from "./client/motion-div.client";

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
    <section className="relative overflow-hidden bg-background text-foreground py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,173,181,0.2),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(57,62,70,0.18),_transparent_40%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(rgba(0,173,181,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(0,173,181,0.25)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="mb-8 max-w-2xl lg:mb-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
              Top Rated
            </span>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Featured Tutors
            </h2>
            <p className="text-lg text-muted-foreground">
              Learn from the best. Our top-rated tutors are verified experts with proven track records.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-primary/40 text-foreground hover:bg-primary/10"
          >
            <Link href="/all-tutors">
              View all tutors
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </MotionDiv>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featuredTutors.map((tutor, index) => (
            <MotionDiv
              key={tutor.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            >
              <Link
                href={`/all-tutors/${tutor.id}`}
                className="group block rounded-2xl border border-border bg-card/50 p-6 transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/50 font-bold text-background">
                      {tutor.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h3 className="font-semibold text-foreground">
                          {tutor.name}
                        </h3>
                        {tutor.isVerified && (
                          <BadgeCheck className="h-4 w-4 fill-primary text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{tutor.subject}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      {tutor.rating}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({tutor.reviews} reviews)
                  </span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                  {tutor.bio}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {tutor.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    {tutor.experience}
                  </div>
                  <div className="font-semibold text-primary">
                    ${tutor.hourlyRate}/hr
                  </div>
                </div>
              </Link>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  );
}
