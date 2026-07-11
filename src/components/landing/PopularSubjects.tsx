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
} from "lucide-react";

const subjects = [
  {
    icon: Code,
    name: "Programming",
    tutorCount: 120,
    color: "#00ADB5",
    href: "/all-tutors",
  },
  {
    icon: Palette,
    name: "Design",
    tutorCount: 85,
    color: "#FF6B6B",
    href: "/all-tutors",
  },
  {
    icon: BarChart3,
    name: "Business",
    tutorCount: 64,
    color: "#4ECDC4",
    href: "/all-tutors",
  },
  {
    icon: Languages,
    name: "Languages",
    tutorCount: 95,
    color: "#FFE66D",
    href: "/all-tutors",
  },
  {
    icon: Music,
    name: "Music",
    tutorCount: 48,
    color: "#95E1D3",
    href: "/all-tutors",
  },
  {
    icon: Calculator,
    name: "Mathematics",
    tutorCount: 72,
    color: "#F7DC6F",
    href: "/all-tutors",
  },
  {
    icon: Camera,
    name: "Photography",
    tutorCount: 38,
    color: "#BB8FCE",
    href: "/all-tutors",
  },
  {
    icon: PenTool,
    name: "Writing",
    tutorCount: 56,
    color: "#85C1E9",
    href: "/all-tutors",
  },
];

export function PopularSubjects() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 lg:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),_transparent_25%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.14),_transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            Explore Subjects
          </span>
          <h2 className="mt-6 text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Popular Subjects
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            From coding to creative arts, find expert tutors in any subject you're passionate about learning.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card/80 p-4 shadow-xl shadow-primary/5">
          <div className="flex animate-marquee-left gap-4 pb-4">
            {[...subjects, ...subjects, ...subjects, ...subjects].map((subject, index) => (
              <div key={`${subject.name}-${index}`}>
                <div className="flex items-stretch gap-2 mx-auto mb-3 *:border *:h-4 *:w-7 *:rounded-sm">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}></div>
                  ))}
                </div>

                <Link
                  href={subject.href}
                  className="group flex min-w-[220px] max-w-[240px] items-center gap-4 rounded-3xl border border-border/60 bg-background/90 px-4 py-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/5"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-3xl"
                    style={{ backgroundColor: `${subject.color}20` }}
                  >
                    <subject.icon className="h-6 w-6 text-current" style={{ color: subject.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-foreground truncate">{subject.name}</p>
                  </div>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
                    {subject.tutorCount}
                  </span>
                </Link>
                <div className="flex items-stretch gap-2 mx-auto mt-3 *:border *:h-4 *:w-7 *:rounded-sm">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div key={i}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-gradient-to-r from-background via-background/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background via-background/90 to-transparent" />
        </div>
      </div>
    </section>
  );
}
