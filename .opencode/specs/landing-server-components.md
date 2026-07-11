# Plan: Convert Landing Components to Server Components

## Goal
Make all landing page components in `src/components/landing/` true Server Components by extracting client-only logic into separate wrapper components.

## Strategy
1. Create a reusable `<MotionDiv>` client wrapper for framer-motion `motion.div` features (scroll-triggered animations).
2. Replace framer-motion carousels with pure CSS `@keyframes` animations.
3. Extract `CountUp` (hooks) into its own client component.
4. Extract SVG path animation (`motion.path`) into a client component.
5. Each main component becomes a Server Component (no `"use client"`, no framer-motion imports).

## Files Created

| File | Purpose |
|---|---|
| `src/components/landing/client/motion-div.client.tsx` | Reusable `<MotionDiv>` client wrapper |
| `src/components/landing/client/count-up.client.tsx` | Count-up animation with IntersectionObserver |
| `src/components/landing/client/how-it-works-path.client.tsx` | SVG path drawing animation |

## Files Modified

| File | Change |
|---|---|
| `Hero.tsx` | Remove framer-motion, use `<MotionDiv>` + CSS animations |
| `HowItWorks.tsx` | Remove framer-motion, use `<MotionDiv>` + `<HowItWorksPath>` |
| `PopularSubjects.tsx` | Remove framer-motion, CSS carousel |
| `FeaturedTutors.tsx` | Remove framer-motion, use `<MotionDiv>` |
| `Testimonials.tsx` | Remove `"use client"`, CSS carousel, use `<CountUp>` |
| `QNA.tsx` | Remove framer-motion, use `<MotionDiv>` |
| `About.tsx` | Remove framer-motion, use `<MotionDiv>` |
| `Contact.tsx` | Remove framer-motion, use `<MotionDiv>` |
| `CallToAction.tsx` | Remove framer-motion, use `<MotionDiv>` |

## Post-Implementation
- `bun run build` and fix any errors
- Push to `origin` (https://github.com/jayedalnahian/skillbridge-c.git)
