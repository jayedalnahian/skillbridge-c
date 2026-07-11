"use client";

import { motion } from "framer-motion";
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
    <section className="relative overflow-hidden bg-background text-foreground py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,173,181,0.15),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(57,62,70,0.2),_transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-4">
              About Us
            </span>
            <h2 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Empowering Learners Worldwide
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              SkillBridge was founded with a simple mission: make quality education
              accessible to everyone. We believe that learning should be personalized,
              flexible, and guided by experts who genuinely care about your success.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Today, we connect thousands of students with expert tutors across
              50+ subjects. Whether you are preparing for exams, learning a new skill,
              or advancing your career, we are here to help you achieve your goals.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Expert Tutors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
            className="space-y-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                className="group flex items-start gap-4 border-l-2 border-primary/40 pl-5 transition-all duration-300 hover:border-primary"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <value.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}