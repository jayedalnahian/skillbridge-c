"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

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
    <section id="faq" className="py-20 lg:py-28 bg-[#1a1f26]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] text-sm font-medium mb-4">
            <HelpCircle className="h-4 w-4" />
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-[#EEEEEE]/70 max-w-2xl mx-auto">
            Everything you need to know about SkillBridge. Can't find what you're looking for? 
            Feel free to contact us directly.
          </p>
        </div>

        {/* Accordion */}
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-[#393E46] bg-[#393E46]/30 rounded-xl mb-3 px-6 data-[state=open]:bg-[#393E46]/50 transition-colors"
            >
              <AccordionTrigger className="text-[#EEEEEE] hover:text-[#00ADB5] hover:no-underline text-left py-5">
                <span className="pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-[#EEEEEE]/70 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="mt-12 text-center p-8 rounded-2xl bg-[#393E46]/30 border border-[#393E46]">
          <h3 className="text-xl font-semibold text-[#EEEEEE] mb-2">
            Still have questions?
          </h3>
          <p className="text-[#EEEEEE]/60 mb-4">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 text-[#00ADB5] hover:text-[#00ADB5]/80 font-medium transition-colors"
          >
            Contact Support
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
