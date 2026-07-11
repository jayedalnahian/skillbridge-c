"use client";

import { motion } from "framer-motion";
import { getIconComponent } from "@/lib/iconMapper";

type StepShape = "square" | "circle" | "hexagon" | "diamond";

interface Step {
  iconName: string;
  title: string;
  description: string;
  shape: StepShape;
  /** position along the 1200x460 desktop path, in viewBox units */
  x: number;
  y: number;
  /** which side of the node the text sits on, desktop only */
  text: "above" | "below";
}

const steps: Step[] = [
  {
    iconName: "Search",
    title: "Find your tutor",
    description: "Filter 500+ verified tutors by subject, rating, or teaching style until one clicks.",
    shape: "square",
    x: 70,
    y: 130,
    text: "above",
  },
  {
    iconName: "Calendar",
    title: "Book a session",
    description: "Grab an open slot on their calendar and confirm it with secure payment, instantly.",
    shape: "circle",
    x: 420,
    y: 360,
    text: "below",
  },
  {
    iconName: "Video",
    title: "Start learning",
    description: "Meet 1-on-1 over video from anywhere, and get guidance built around your pace.",
    shape: "hexagon",
    x: 780,
    y: 110,
    text: "above",
  },
  {
    iconName: "Star",
    title: "Leave a review",
    description: "Rate the session so the next student knows exactly who to trust.",
    shape: "diamond",
    x: 1140,
    y: 360,
    text: "below",
  },
];

const PATH_D =
  "M70,130 C 230,130 260,360 420,360 C 580,360 620,110 780,110 C 940,110 970,360 1140,360";

function ShapeOutline({ shape, className }: { shape: StepShape; className?: string }) {
  if (shape === "circle") {
    return <div className={`rounded-full ${className}`} />;
  }
  if (shape === "diamond") {
    return <div className={`rotate-45 rounded-md ${className}`} />;
  }
  if (shape === "hexagon") {
    return (
      <div
        className={`h-11 w-11 ${className}`}
        style={{
          clipPath:
            "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      />
    );
  }
  return <div className={`rounded-xl ${className}`} />;
}

function Node({ step }: { step: Step }) {
  const Icon = getIconComponent(step.iconName);

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      {/* <ShapeOutline
        shape={step.shape}
        className="absolute inset-0 border-2 border-primary bg-background/80 text-primary"
      /> */}
      <Icon className="relative h-8 w-8 text-primary" strokeWidth={2.25} />
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-24 text-foreground lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,173,181,0.16),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(57,62,70,0.2),_transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16 max-w-xl lg:mb-24"
        >
          <span className="mb-4 block text-sm font-medium uppercase tracking-[0.2em] text-primary">
            The path
          </span>
          <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            From question to confidence, in four hops.
          </h2>
        </motion.div>

        {/* Desktop: signal path with nodes drawn on scroll */}
        <div className="relative hidden aspect-[1200/460] w-full lg:block">
          <svg viewBox="0 0 1200 460" className="absolute inset-0 h-full w-full overflow-visible">
            <path
              d={PATH_D}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="1 10"
              className="text-border"
            />
            <motion.path
              d={PATH_D}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-primary"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
            <circle r="4.5" fill="currentColor" className="text-primary">
              <animateMotion dur="7s" repeatCount="indefinite" path={PATH_D} />
            </circle>
          </svg>

          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.35, ease: "easeOut" }}
              className="absolute"
              style={{
                left: `${(step.x / 1200) * 100}%`,
                top: `${(step.y / 460) * 100}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative mt-3 flex justify-center">
                <Node step={step} />
              </div>

              <div
                className={`absolute text-center left-1/2 w-56 -translate-x-1/2  ${
                  step.text === "above" ? "bottom-full mb-4" : "top-full mt-4"
                }`}
              >
                <h3 className="mb-1.5 text-base font-semibold text-foreground ">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile / tablet: vertical line, no path math needed */}
        <div className="relative space-y-12 lg:hidden">
          <div className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              className="relative flex gap-5"
            >
              <div className="relative shrink-0 mt-4 bg-background">
                <Node step={step} />
              </div>
              
              <div className="pt-0.5">
                <h3 className="mb-1.5 text-base font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}