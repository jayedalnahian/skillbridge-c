"use client";

import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "Computer Science Student",
    avatar: "AT",
    rating: 5,
    content:
      "SkillBridge completely transformed my coding journey. I went from struggling with basic JavaScript to building full-stack applications in just 3 months. My tutor James was incredibly patient and knowledgeable.",
    subject: "Programming",
  },
  {
    id: "2",
    name: "Maria Garcia",
    role: "Marketing Professional",
    avatar: "MG",
    rating: 5,
    content:
      "I needed to learn data analytics for my career transition. The tutor I found on SkillBridge made complex statistics concepts so easy to understand. Highly recommend for anyone looking to upskill!",
    subject: "Data Analytics",
  },
  {
    id: "3",
    name: "David Kim",
    role: "High School Student",
    avatar: "DK",
    rating: 5,
    content:
      "My math tutor helped me improve from a C to an A+ in AP Calculus. The 1-on-1 attention made all the difference. The booking system is super convenient too!",
    subject: "Mathematics",
  },
  {
    id: "4",
    name: "Sophia Chen",
    role: "UX Designer",
    avatar: "SC",
    rating: 5,
    content:
      "As a designer wanting to learn motion graphics, I found the perfect tutor here. The platform made it so easy to compare tutors and book sessions that fit my schedule.",
    subject: "Motion Design",
  },
  {
    id: "5",
    name: "James Wilson",
    role: "Entrepreneur",
    avatar: "JW",
    rating: 5,
    content:
      "I used SkillBridge to learn business strategy before launching my startup. The quality of tutors is exceptional - many are industry professionals with real-world experience.",
    subject: "Business Strategy",
  },
  {
    id: "6",
    name: "Emily Brown",
    role: "Piano Enthusiast",
    avatar: "EB",
    rating: 5,
    content:
      "Finally achieved my dream of playing piano! My tutor adapted lessons to my pace and musical interests. The progress tracking feature kept me motivated throughout.",
    subject: "Music",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-[#1a1f26]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] text-sm font-medium mb-4">
            Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-[#EEEEEE]/70 max-w-2xl mx-auto">
            Join thousands of satisfied learners who have achieved their goals with SkillBridge.
          </p>
        </div>

        {/* Testimonials Grid - Masonry-like layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`p-6 rounded-2xl bg-[#393E46]/30 border border-[#393E46] hover:border-[#00ADB5]/30 transition-all duration-300 ${
                index === 0 || index === 3 ? "lg:row-span-1" : ""
              }`}
            >
              {/* Quote Icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-[#00ADB5]/30" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-[#00ADB5] fill-[#00ADB5]"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-[#EEEEEE]/80 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#393E46]">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00ADB5] to-[#393E46] flex items-center justify-center text-[#EEEEEE] font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-[#EEEEEE]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#EEEEEE]/50">
                    {testimonial.role}
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 text-xs rounded-md bg-[#00ADB5]/10 text-[#00ADB5]">
                    {testimonial.subject}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "15,000+", label: "Happy Students" },
            { value: "98%", label: "Satisfaction Rate" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "50,000+", label: "Sessions Completed" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-[#00ADB5] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#EEEEEE]/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
