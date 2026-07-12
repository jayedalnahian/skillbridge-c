"use client";

import { motion } from "framer-motion";
import { Star, MessageSquare, Quote } from "lucide-react";
import { format } from "date-fns";
import { IReview } from "@/types/review.types";
import { ScrollReveal } from "./ui/ScrollReveal";
import { GlassCard } from "./ui/GlassCard";
import { cn } from "@/lib/utils";

interface ReviewsSectionProps {
  reviews: IReview[];
}

function ReviewCard({ review, index }: { review: IReview; index: number }) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3.5 w-3.5",
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  const getName = () => review.Student?.User?.name || "Anonymous";
  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const isLongComment = (review.comment?.length || 0) > 150;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0, 1] }}
    >
      <GlassCard className="group p-5 sm:p-6 transition-all duration-500 hover:border-border/50">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/10 text-sm font-bold text-foreground ring-2 ring-border">
              {getInitials(getName())}
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{getName()}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                <span className="text-sm font-semibold text-foreground/70">{review.rating}</span>
              </div>
            </div>

            {/* Comment */}
            {review.comment && (
              <div className="relative">
                {isLongComment ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.comment.slice(0, 150)}...&rdquo;
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                )}
              </div>
            )}

            {/* Quote decoration */}
            <div className="flex items-center gap-2 pt-1">
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
              <Quote className="h-3 w-3 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  return (
    <ScrollReveal direction="up" delay={0.3}>
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-1 rounded-full bg-gradient-to-b from-accent to-yellow-500" />
            <h2
              className="text-xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              Reviews
            </h2>
            <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
              {reviews.length}
            </span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted ring-1 ring-border">
              <MessageSquare className="h-7 w-7 text-muted-foreground" />
            </div>
            <p
              className="text-lg font-semibold text-muted-foreground mb-1"
              style={{ fontFamily: "var(--font-syne)" }}
            >
              No reviews yet
            </p>
            <p className="text-sm text-muted-foreground/70">
              Be the first to share your experience
            </p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, idx) => (
              <ReviewCard key={review.id} review={review} index={idx} />
            ))}
          </div>
        )}
      </section>
    </ScrollReveal>
  );
}
