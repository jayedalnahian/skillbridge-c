"use client";

import { Search, Calendar, Video, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Find Your Tutor",
    description:
      "Browse through 500+ verified tutors by subject, rating, or expertise. Filter to find the perfect match for your learning goals.",
  },
  {
    icon: Calendar,
    title: "Book a Session",
    description:
      "Select a convenient time slot from the tutor's availability calendar. Instantly confirm your booking with secure payment.",
  },
  {
    icon: Video,
    title: "Start Learning",
    description:
      "Join your 1-on-1 video session from anywhere. Get personalized guidance, ask questions, and accelerate your learning.",
  },
  {
    icon: Star,
    title: "Leave a Review",
    description:
      "After your session, rate your experience and help other students find great tutors. Build the community together.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 bg-[#222831]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-4">
            How SkillBridge Works
          </h2>
          <p className="text-lg text-[#EEEEEE]/70 max-w-2xl mx-auto">
            Get started in minutes. From finding a tutor to booking your first session,
            we've made learning seamless and accessible.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-[#00ADB5]/50 to-transparent" />
              )}

              <div className="relative p-6 rounded-2xl bg-[#393E46]/30 border border-[#393E46] hover:border-[#00ADB5]/50 transition-all duration-300 hover:bg-[#393E46]/50">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#00ADB5] flex items-center justify-center text-[#222831] font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-[#00ADB5]/10 flex items-center justify-center mb-5 group-hover:bg-[#00ADB5]/20 transition-colors">
                  <step.icon className="h-7 w-7 text-[#00ADB5]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-[#EEEEEE] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#EEEEEE]/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
