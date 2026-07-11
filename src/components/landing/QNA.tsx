

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from "lucide-react";
import { MotionDiv } from "./client/motion-div.client";

const faqs = [
  {
    question: "How do I book a tutoring session?",
    answer:
      "Booking a session is easy! Browse our tutor directory, select a tutor that matches your needs, view their available time slots, and click 'Book Session'. You'll receive an instant confirmation with all the details.",
  },
  {
    question: "What subjects can I learn on SkillBridge?",
    answer:
      "SkillBridge offers 50+ subjects including Programming (Python, JavaScript, React), Design (UI/UX, Graphic Design), Business (Marketing, Finance), Languages, Music, Mathematics, and more. New subjects are added regularly based on demand.",
  },
  {
    question: "How are tutors vetted?",
    answer:
      "All tutors go through a rigorous verification process. We verify their professional credentials, conduct background checks, and review their teaching experience. Only experts with proven expertise and teaching ability are approved to teach on our platform.",
  },
  {
    question: "Can I reschedule or cancel a booking?",
    answer:
      "Yes! You can reschedule or cancel sessions up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may be subject to a cancellation fee depending on the tutor's policy.",
  },
  {
    question: "How do payments work?",
    answer:
      "We use secure Stripe payment processing. You pay only when you book a session. We hold the payment until the session is completed to ensure your satisfaction. If you're not satisfied, we offer a money-back guarantee.",
  },
  {
    question: "What happens if I'm not satisfied with a session?",
    answer:
      "Your satisfaction is our priority. If you're not happy with a session, contact us within 24 hours and we'll work with you to make it right - whether that's a free rescheduled session or a full refund.",
  },
  {
    question: "Can I become a tutor on SkillBridge?",
    answer:
      "Absolutely! If you have expertise in a subject and passion for teaching, we'd love to have you. Click 'Become a Tutor' to register, complete your profile, set your availability and rates, and start earning by sharing your knowledge.",
  },
  {
    question: "Are sessions conducted online or in-person?",
    answer:
      "All sessions are conducted online via our integrated video platform. This allows for flexibility - you can learn from expert tutors anywhere in the world, from the comfort of your home. All you need is a stable internet connection.",
  },
];

export function QNA() {
  return (
    <section className="relative overflow-hidden bg-background text-foreground py-20 lg:py-28">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(0,173,181,0.12),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(57,62,70,0.18),_transparent_45%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <HelpCircle className="h-4 w-4" />
            Got Questions?
          </span>
          <h2 className="mb-4 mt-6 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Everything you need to know about SkillBridge. Can&apos;t find what you&apos;re looking for?
            Feel free to contact us directly.
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="mb-3 rounded-xl border border-border bg-card/50 px-6 transition-colors data-[state=open]:bg-card/80"
                >
                  <AccordionTrigger className="py-5 text-left text-foreground hover:text-primary hover:no-underline">
                    <span className="pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </MotionDiv>
            ))}
          </Accordion>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
          className="mt-12 rounded-2xl border border-border bg-card/50 p-8 text-center"
        >
          <h3 className="mb-2 text-xl font-semibold text-foreground">
            Still have questions?
          </h3>
          <p className="mb-4 text-muted-foreground">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 font-medium text-primary transition-colors hover:text-primary/80"
          >
            Contact Support
            <ArrowRight className="h-4 w-4" />
          </Link>
        </MotionDiv>
      </div>
    </section>
  );
}
