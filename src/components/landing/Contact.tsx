"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Clock, ArrowRight } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "support@skillbridge.com",
    href: "mailto:support@skillbridge.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "123 Learning Street, Tech City, TC 12345",
    href: "#",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon-Fri: 9AM - 6PM EST",
    href: "#",
  },
];

export function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#222831]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Info */}
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#00ADB5]/10 text-[#00ADB5] text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#EEEEEE] mb-6">
              Contact Us
            </h2>
            <p className="text-lg text-[#EEEEEE]/70 mb-8 leading-relaxed">
              Have questions? We would love to hear from you. Send us a message 
              and we will respond as soon as possible.
            </p>

            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-start gap-4 p-4 rounded-xl bg-[#393E46]/30 border border-[#393E46] hover:border-[#00ADB5]/50 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#00ADB5]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00ADB5]/20 transition-colors">
                    <item.icon className="h-5 w-5 text-[#00ADB5]" />
                  </div>
                  <div>
                    <div className="text-sm text-[#EEEEEE]/50 mb-1">
                      {item.label}
                    </div>
                    <div className="text-sm text-[#EEEEEE] font-medium">
                      {item.value}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right - Quick Links */}
          <div className="p-8 rounded-2xl bg-[#393E46]/30 border border-[#393E46]">
            <h3 className="text-xl font-semibold text-[#EEEEEE] mb-6">
              Quick Help
            </h3>
            <div className="space-y-4">
              {[
                { label: "Browse all tutors", href: "/all-tutors" },
                { label: "How to book a session", href: "/#how-it-works" },
                { label: "Become a tutor", href: "/register" },
                { label: "FAQ & Help Center", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#222831]/50 hover:bg-[#222831] transition-colors group"
                >
                  <span className="text-[#EEEEEE]/80 group-hover:text-[#EEEEEE]">
                    {link.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#00ADB5] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-[#393E46]">
              <p className="text-sm text-[#EEEEEE]/60 mb-4">
                Ready to start learning?
              </p>
              <Link href="/all-tutors">
                <Button className="w-full bg-[#00ADB5] hover:bg-[#00ADB5]/90 text-[#222831] font-semibold">
                  Find a Tutor Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
