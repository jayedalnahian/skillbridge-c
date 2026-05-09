"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export function CallToAction() {
  return (
    <section id="get-started" className="py-20 lg:py-28 bg-[#222831]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00ADB5]/20 via-[#393E46]/50 to-[#222831]">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div
              className="absolute top-0 right-0 w-96 h-96 opacity-30"
              style={{
                background:
                  "radial-gradient(circle at 70% 30%, #00ADB5 0%, transparent 50%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-96 h-96 opacity-20"
              style={{
                background:
                  "radial-gradient(circle at 30% 70%, #00ADB5 0%, transparent 50%)",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ADB5]/10 border border-[#00ADB5]/30 mb-6">
                <Sparkles className="h-4 w-4 text-[#00ADB5]" />
                <span className="text-sm text-[#00ADB5] font-medium">
                  Start Your Learning Journey Today
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-6">
                Ready to Unlock Your{" "}
                <span className="text-[#00ADB5]">Full Potential?</span>
              </h2>

              {/* Description */}
              <p className="text-lg text-[#EEEEEE]/70 mb-10 max-w-2xl mx-auto">
                Whether you're looking to learn a new skill, advance your career, 
                or pursue a passion, SkillBridge connects you with expert tutors 
                who can guide you every step of the way.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-[#222831] font-semibold px-8 py-6 text-base transition-all hover:scale-105"
                >
                  <Link href="/all-tutors">
                    Find a Tutor
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[#EEEEEE]/30 text-[#EEEEEE] hover:bg-[#EEEEEE]/10 px-8 py-6 text-base transition-all"
                >
                  <Link href="/register">
                    Become a Tutor
                  </Link>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#EEEEEE]/50">
                <span>No credit card required</span>
                <span className="hidden sm:inline">•</span>
                <span>Free first session for new users</span>
                <span className="hidden sm:inline">•</span>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info Cards */}
        <div className="mt-12 grid sm:grid-cols-3 gap-6">
          {[
            {
              title: "For Students",
              description: "Learn from industry experts at your own pace. Get personalized 1-on-1 attention.",
              cta: "Start Learning",
              href: "/register",
            },
            {
              title: "For Tutors",
              description: "Share your expertise and earn income. Set your own schedule and rates.",
              cta: "Start Teaching",
              href: "/register",
            },
            {
              title: "For Organizations",
              description: "Upskill your team with customized learning programs and corporate training.",
              cta: "Contact Sales",
              href: "/contact",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl bg-[#393E46]/20 border border-[#393E46] text-center"
            >
              <h3 className="text-lg font-semibold text-[#EEEEEE] mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-[#EEEEEE]/60 mb-4">
                {card.description}
              </p>
              <Link
                href={card.href}
                className="text-[#00ADB5] hover:text-[#00ADB5]/80 text-sm font-medium inline-flex items-center gap-1"
              >
                {card.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
