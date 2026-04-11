"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Calendar, CheckCircle, Users, BookOpen } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden bg-[#222831]">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Radial gradient from top-right */}
        <div
          className="absolute -top-1/2 -right-1/2 w-full h-full opacity-30"
          style={{
            background:
              "radial-gradient(circle at 70% 30%, #00ADB5 0%, transparent 50%)",
          }}
        />
        {/* Secondary gradient from bottom-left */}
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full opacity-20"
          style={{
            background:
              "radial-gradient(circle at 30% 70%, #393E46 0%, transparent 50%)",
          }}
        />
        {/* Subtle mesh pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ADB5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Copy & CTAs */}
          <div className="text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#393E46]/50 border border-[#00ADB5]/30 mb-6 animate-pulse">
              <Star className="h-4 w-4 text-[#00ADB5] fill-[#00ADB5]" />
              <span className="text-sm text-[#EEEEEE]/90">
                Join 5,000+ students already learning
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#EEEEEE] leading-tight mb-6">
              Connect with Expert Tutors,{" "}
              <span className="text-[#00ADB5]">Learn Anything.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-[#EEEEEE]/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              SkillBridge is the premier platform for students to find 1-on-1
              mentorship. Book sessions instantly, track your progress, and
              master new skills with industry professionals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-[#222831] font-semibold px-8 py-6 text-base transition-all hover:scale-105"
              >
                <Link href="/tutors">Find a Tutor</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-[#00ADB5] text-[#EEEEEE] hover:bg-[#00ADB5]/10 hover:text-[#00ADB5] px-8 py-6 text-base transition-all"
              >
                <Link href="/register">Become a Tutor</Link>
              </Button>
            </div>

            {/* Social Proof Stats */}
            <div className="mt-10 pt-8 border-t border-[#393E46]/50">
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#00ADB5]">500+</div>
                  <div className="text-sm text-[#EEEEEE]/60">Expert Tutors</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#00ADB5]">10k+</div>
                  <div className="text-sm text-[#EEEEEE]/60">
                    Sessions Booked
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-[#00ADB5]">4.9</div>
                  <div className="text-sm text-[#EEEEEE]/60">User Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Stack */}
          <div className="relative hidden lg:block">
            {/* Tutor Card */}
            <div className="absolute top-0 left-0 w-72 bg-[#393E46]/60 backdrop-blur-md rounded-2xl border border-white/10 p-5 shadow-2xl animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#00ADB5]/50 flex items-center justify-center text-[#222831] font-bold">
                  JD
                </div>
                <div>
                  <div className="font-semibold text-[#EEEEEE]">
                    John Davidson
                  </div>
                  <div className="text-sm text-[#EEEEEE]/60">
                    React & Node.js Expert
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-[#00ADB5] fill-[#00ADB5]"
                  />
                ))}
                <span className="text-sm text-[#EEEEEE]/60 ml-1">5.0</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#EEEEEE]/70">
                <Users className="h-4 w-4 text-[#00ADB5]" />
                <span>200+ students taught</span>
              </div>
            </div>

            {/* Booking Confirmed Notification */}
            <div className="absolute top-32 right-0 w-64 bg-[#393E46]/80 backdrop-blur-md rounded-xl border border-[#00ADB5]/30 p-4 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#00ADB5]/20 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-[#00ADB5]" />
                </div>
                <div>
                  <div className="font-medium text-[#EEEEEE] text-sm">
                    Booking Confirmed!
                  </div>
                  <div className="text-xs text-[#EEEEEE]/60">
                    Session with Sarah M.
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-[#EEEEEE]/70">
                <Calendar className="h-3 w-3 text-[#00ADB5]" />
                <span>Tomorrow, 2:00 PM</span>
              </div>
            </div>

            {/* Skills Floating Card */}
            <div className="absolute bottom-20 left-10 w-56 bg-[#393E46]/50 backdrop-blur-md rounded-xl border border-white/10 p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-[#00ADB5]" />
                <span className="font-medium text-[#EEEEEE] text-sm">
                  Popular Skills
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["React", "Python", "Design", "Node.js"].map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 text-xs rounded-md bg-[#00ADB5]/10 text-[#00ADB5] border border-[#00ADB5]/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 right-20 w-20 h-20 rounded-full bg-[#00ADB5]/10 blur-xl" />
            <div className="absolute top-40 left-40 w-16 h-16 rounded-full bg-[#393E46]/50 blur-lg" />
          </div>
        </div>
      </div>
    </section>
  );
}
