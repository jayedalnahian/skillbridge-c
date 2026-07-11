import { MotionDiv } from "./client/motion-div.client";
import { HowItWorksPath, MobileStep } from "./client/how-it-works-path.client";

export type StepShape = "square" | "circle" | "hexagon" | "diamond";

export interface Step {
  iconName: string;
  title: string;
  description: string;
  shape: StepShape;
  x: number;
  y: number;
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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-background py-24 text-foreground lg:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,173,181,0.16),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(57,62,70,0.2),_transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionDiv
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
        </MotionDiv>

        <HowItWorksPath steps={steps} />

        <div className="relative space-y-12 lg:hidden">
          <div className="absolute bottom-6 left-[21px] top-6 w-px bg-gradient-to-b from-primary via-primary/40 to-transparent" />
          {steps.map((step, index) => (
            <MobileStep key={step.title} step={step} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
