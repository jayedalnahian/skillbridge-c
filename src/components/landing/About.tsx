"use client";

import { Target, Users, Zap, Award } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Personalized Learning",
    description:
      "Every student learns differently. Our tutors adapt their teaching style to match your pace and goals.",
  },
  {
    icon: Users,
    title: "Expert Tutors",
    description:
      "All tutors are thoroughly vetted professionals with proven expertise in their subjects.",
  },
  {
    icon: Zap,
    title: "Flexible Scheduling",
    description:
      "Book sessions that fit your schedule. Learn at your own pace, anytime, anywhere.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description:
      "Not satisfied with your session? We offer a hassle-free refund policy.",
  },
];

export function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#1a1f26]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] text-sm font-medium mb-4">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-6">
              Empowering Learners Worldwide
            </h2>
            <p className="text-lg text-[#EEEEEE]/70 mb-6 leading-relaxed">
              SkillBridge was founded with a simple mission: make quality education 
              accessible to everyone. We believe that learning should be personalized, 
              flexible, and guided by experts who genuinely care about your success.
            </p>
            <p className="text-lg text-[#EEEEEE]/70 mb-8 leading-relaxed">
              Today, we connect thousands of students with expert tutors across 
              50+ subjects. Whether you are preparing for exams, learning a new skill, 
              or advancing your career, we are here to help you achieve your goals.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-[#00ADB5]">500+</div>
                <div className="text-sm text-[#EEEEEE]/60">Expert Tutors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00ADB5]">15K+</div>
                <div className="text-sm text-[#EEEEEE]/60">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#00ADB5]">50+</div>
                <div className="text-sm text-[#EEEEEE]/60">Subjects</div>
              </div>
            </div>
          </div>

          {/* Right - Values Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-6 rounded-2xl bg-[#393E46]/30 border border-[#393E46] hover:border-[#00ADB5]/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#00ADB5]/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-[#00ADB5]" />
                </div>
                <h3 className="text-lg font-semibold text-[#EEEEEE] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[#EEEEEE]/60 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
