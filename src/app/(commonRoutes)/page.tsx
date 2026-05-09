import {
  Hero,
  HowItWorks,
  PopularSubjects,
  FeaturedTutors,
  Testimonials,
  QNA,
  About,
  Contact,
  CallToAction,
} from "@/components/landing";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Hero />
      <HowItWorks />
      <PopularSubjects />
      <FeaturedTutors />
      <Testimonials />
      <QNA />
      <About />
      <Contact />
      <CallToAction />
    </main>
  );
}
