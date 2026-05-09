"use client";

import Link from "next/link";
import {
  Code,
  Palette,
  BarChart3,
  Languages,
  Music,
  Calculator,
  Camera,
  PenTool,
  ArrowRight,
} from "lucide-react";

const subjects = [
  {
    icon: Code,
    name: "Programming",
    description: "Python, JavaScript, React, Node.js & more",
    tutorCount: 120,
    color: "#00ADB5",
    href: "/tutors?category=programming",
  },
  {
    icon: Palette,
    name: "Design",
    description: "UI/UX, Graphic Design, Illustration",
    tutorCount: 85,
    color: "#FF6B6B",
    href: "/tutors?category=design",
  },
  {
    icon: BarChart3,
    name: "Business",
    description: "Marketing, Finance, Management",
    tutorCount: 64,
    color: "#4ECDC4",
    href: "/tutors?category=business",
  },
  {
    icon: Languages,
    name: "Languages",
    description: "English, Spanish, French, Mandarin",
    tutorCount: 95,
    color: "#FFE66D",
    href: "/tutors?category=languages",
  },
  {
    icon: Music,
    name: "Music",
    description: "Piano, Guitar, Singing, Theory",
    tutorCount: 48,
    color: "#95E1D3",
    href: "/tutors?category=music",
  },
  {
    icon: Calculator,
    name: "Mathematics",
    description: "Algebra, Calculus, Statistics",
    tutorCount: 72,
    color: "#F7DC6F",
    href: "/tutors?category=mathematics",
  },
  {
    icon: Camera,
    name: "Photography",
    description: "Digital, Portrait, Editing",
    tutorCount: 38,
    color: "#BB8FCE",
    href: "/tutors?category=photography",
  },
  {
    icon: PenTool,
    name: "Writing",
    description: "Creative, Academic, Copywriting",
    tutorCount: 56,
    color: "#85C1E9",
    href: "/tutors?category=writing",
  },
];

export function PopularSubjects() {
  return (
    <section className="py-20 lg:py-28 bg-[#222831]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] text-sm font-medium mb-4">
            Explore Subjects
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-4">
            Popular Subjects
          </h2>
          <p className="text-lg text-[#EEEEEE]/70 max-w-2xl mx-auto">
            From coding to creative arts, find expert tutors in any subject you're passionate about learning.
          </p>
        </div>

        {/* Subjects Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <Link
              key={subject.name}
              href={subject.href}
              className="group p-6 rounded-2xl bg-[#393E46]/30 border border-[#393E46] hover:border-[#00ADB5]/50 transition-all duration-300 hover:bg-[#393E46]/50"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: `${subject.color}20` }}
              >
                <subject.icon
                  className="h-6 w-6"
                  style={{ color: subject.color }}
                />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-[#EEEEEE] mb-2 group-hover:text-[#00ADB5] transition-colors">
                {subject.name}
              </h3>
              <p className="text-[#EEEEEE]/60 text-sm mb-4">
                {subject.description}
              </p>

              {/* Tutor Count */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#00ADB5]">
                  {subject.tutorCount} tutors
                </span>
                <ArrowRight className="h-4 w-4 text-[#EEEEEE]/40 group-hover:text-[#00ADB5] transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/all-tutors"
            className="inline-flex items-center gap-2 text-[#00ADB5] hover:text-[#00ADB5]/80 font-medium transition-colors"
          >
            View all subjects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
