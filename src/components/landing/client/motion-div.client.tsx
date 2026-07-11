"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

export function MotionDiv({ children, ...props }: HTMLMotionProps<"div">) {
  return <motion.div {...props}>{children}</motion.div>;
}

export const MotionH2 = motion.h2;
export const MotionP = motion.p;
export const MotionSpan = motion.span;
