"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarCheck2, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import "../../../public/skillbridge avatart img.png"

const featuredSkills = ["React", "Python", "Design", "Node.js"];

export function Hero() {
  return (
    <section className="relative flex min-h-[60vh] items-center overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,173,181,0.25),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(57,62,70,0.22),_transparent_40%)]" />
        <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(0,173,181,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(0,173,181,0.25)_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-2xl text-center lg:text-left"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Trusted by learners and tutors worldwide
            </div>

            <h1 className="mb-5 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect with expert tutors and
              <span className="block text-primary">learn faster.</span>
            </h1>

            <p className="mx-auto mb-8 max-w-xl text-lg leading-8 text-muted-foreground lg:mx-0">
              SkillBridge helps you find the right mentor, book sessions in minutes,
              and build confidence through personalized guidance.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row lg:items-start">
              <Button
                asChild
                size="lg"
                className="h-14 w-full rounded-full bg-gradient-to-r from-primary via-cyan-500 to-emerald-500 px-8 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/30 sm:w-auto"
              >
                <Link href="/all-tutors" className="inline-flex items-center gap-2">
                  Explore tutors
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 w-full rounded-full border-primary/40 bg-background/80 px-8 text-base font-semibold text-foreground shadow-sm transition-all duration-300 hover:scale-[1.03] hover:border-primary hover:bg-primary/10 sm:w-auto"
              >
                <Link href="/how-it-works">How it works</Link>
              </Button>
            </div>

            <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              <div>
                <div className="text-2xl font-semibold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Expert tutors</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Sessions booked</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-primary">4.9/5</div>
                <div className="text-sm text-muted-foreground">Average rating</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="relative mx-auto hidden h-[320px] w-full max-w-[460px] lg:block"
          >
            <motion.div
              animate={{ y: [0, -8, 0], rotate: [0, -1, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute left-0 top-4 w-72 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-xl backdrop-blur"
            >
              <div className="mb-4 flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="skillbridge avatart img.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">Elena Davidson</p>
                  <p className="text-sm text-muted-foreground">Professor of Mathematics</p>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-1">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-white text-primary" />
                ))}
                {Array.from({ length: 1 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4 text-primary" />
                200+ students taught
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0], x: [0, 3, 0] }}
              transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute right-0 top-28 w-64 rounded-2xl border border-primary/20 bg-background/80 p-4 shadow-xl backdrop-blur"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CalendarCheck2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Booking confirmed</p>
                  <p className="text-xs text-muted-foreground">Tomorrow • 2:00 PM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              className="absolute bottom-4 left-10 w-56 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-lg backdrop-blur"
            >
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
                <BookOpen className="h-4 w-4 text-primary" />
                Popular skills
              </div>
              <div className="flex flex-wrap gap-2">
                {featuredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
