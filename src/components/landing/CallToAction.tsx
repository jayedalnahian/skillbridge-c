

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { MotionDiv, MotionH2, MotionP } from "./client/motion-div.client";

export function CallToAction() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 lg:py-28">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-muted/50 to-background px-8 py-16 lg:px-16 lg:py-20">
          <div className="absolute inset-0">
            <div className="absolute right-0 top-0 h-96 w-96 opacity-30 bg-[radial-gradient(circle_at_70%_30%,rgba(0,173,181,0.4),transparent_50%)]" />
            <div className="absolute bottom-0 left-0 h-96 w-96 opacity-20 bg-[radial-gradient(circle_at_30%_70%,rgba(0,173,181,0.3),transparent_50%)]" />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Start Your Learning Journey Today
              </span>
            </MotionDiv>

            <MotionH2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mb-6 mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl"
            >
              Ready to Unlock Your{" "}
              <span className="text-primary">Full Potential?</span>
            </MotionH2>

            <MotionP
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground"
            >
              Whether you&apos;re looking to learn a new skill, advance your career,
              or pursue a passion, SkillBridge connects you with expert tutors
              who can guide you every step of the way.
            </MotionP>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary text-primary-foreground px-8 py-6 text-base font-semibold transition-all hover:scale-105 hover:bg-primary/90"
              >
                <Link href="/all-tutors">
                  Find a Tutor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-foreground/30 px-8 py-6 text-base text-foreground transition-all hover:bg-foreground/10"
              >
                <Link href="/register">
                  Become a Tutor
                </Link>
              </Button>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground"
            >
              <span>No credit card required</span>
              <span className="hidden sm:inline">&bull;</span>
              <span>Free first session for new users</span>
              <span className="hidden sm:inline">&bull;</span>
              <span>Cancel anytime</span>
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
}
