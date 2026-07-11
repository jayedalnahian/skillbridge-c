"use client";

import { motion } from "framer-motion";
import { getIconComponent } from "@/lib/iconMapper";

type StepShape = "square" | "circle" | "hexagon" | "diamond";

interface Step {
  iconName: string;
  title: string;
  description: string;
  shape: StepShape;
  x: number;
  y: number;
  text: "above" | "below";
}

const PATH_D =
  "M70,130 C 230,130 260,360 420,360 C 580,360 620,110 780,110 C 940,110 970,360 1140,360";

function Node({ step }: { step: Step }) {
  const Icon = getIconComponent(step.iconName);

  return (
    <div className="relative flex h-12 w-12 items-center justify-center">
      <Icon className="relative h-8 w-8 text-primary" strokeWidth={2.25} />
    </div>
  );
}

export function HowItWorksPath({ steps }: { steps: Step[] }) {
  return (
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
            className={`absolute text-center left-1/2 w-56 -translate-x-1/2 ${
              step.text === "above" ? "bottom-full mb-4" : "top-full mt-4"
            }`}
          >
            <h3 className="mb-1.5 text-base font-semibold text-foreground">{step.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function MobileStep({ step, index }: { step: Step; index: number }) {
  const Icon = getIconComponent(step.iconName);
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="relative flex gap-5"
    >
      <div className="relative shrink-0 mt-4 bg-background">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <Icon className="relative h-8 w-8 text-primary" strokeWidth={2.25} />
        </div>
      </div>

      <div className="pt-0.5">
        <h3 className="mb-1.5 text-base font-semibold text-foreground">{step.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  );
}
