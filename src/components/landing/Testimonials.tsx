import { Star, Quote } from "lucide-react";
import { CountUp } from "./client/count-up.client";

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
    <section className="relative overflow-hidden bg-background text-foreground py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,173,181,0.18),_transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(57,62,70,0.2),_transparent_40%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            Success Stories
          </span>
          <h2 className="mb-4 mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            What Our Students Say
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join thousands of satisfied learners who have achieved their goals with SkillBridge.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-marquee-left gap-6 pb-8">
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`${t.id}-${i}`}
                className="min-w-[380px] max-w-[420px] shrink-0"
              >
                <div className="relative rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
                  <Quote className="absolute right-6 top-6 h-16 w-16 text-primary/10" />
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-6 text-base leading-relaxed text-foreground/80">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-muted-foreground text-sm font-semibold text-background">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {t.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        {t.subject}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex animate-marquee-right gap-6">
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div
                key={`${t.id}-r-${i}`}
                className="min-w-[380px] max-w-[420px] shrink-0"
              >
                <div className="relative rounded-2xl border border-border/60 bg-card/40 p-8 backdrop-blur-sm">
                  <Quote className="absolute right-6 top-6 h-16 w-16 text-primary/10" />
                  <div className="mb-4 flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="mb-6 text-base leading-relaxed text-foreground/80">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-muted-foreground text-sm font-semibold text-background">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">
                        {t.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                    <div className="ml-auto">
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                        {t.subject}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { value: "15000", label: "Happy Students", suffix: "+" },
            { value: "98", label: "Satisfaction Rate", suffix: "%" },
            { value: "4.9", label: "Average Rating", suffix: "/5" },
            { value: "50000", label: "Sessions Completed", suffix: "+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-primary lg:text-4xl">
                <CountUp value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
