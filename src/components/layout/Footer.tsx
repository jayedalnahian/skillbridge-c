"use client";

import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  students: {
    title: "For Students",
    links: [
      { label: "Find Tutors", href: "/all-tutors" },
      { label: "How it Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/#faq" },
      { label: "Student Dashboard", href: "/dashboard" },
    ],
  },
  tutors: {
    title: "For Tutors",
    links: [
      { label: "Become a Tutor", href: "/register" },
      { label: "Tutor Resources", href: "/#faq" },
      { label: "Tutor Dashboard", href: "/tutor/dashboard" },
      { label: "Success Stories", href: "/#testimonials" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Us", href: "/#about" },
      { label: "Contact", href: "/#contact" },
      { label: "FAQ", href: "/#faq" },
      { label: "Careers", href: "/contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/contact" },
      { label: "Privacy Policy", href: "/contact" },
      { label: "Cookie Policy", href: "/contact" },
    ],
  },
};

const contactInfo = [
  { icon: Mail, value: "support@skillbridge.com" },
  { icon: Phone, value: "+1 (555) 123-4567" },
  { icon: MapPin, value: "123 Learning Street, Tech City" },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:scale-105">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground">
                SkillBridge
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Connect with expert tutors and learn anything. Personalized 1-on-1 
              sessions tailored to your goals.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item) => (
                <div key={item.value} className="flex items-center gap-3 text-sm">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-foreground font-semibold mb-4 text-sm">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h3 className="text-foreground font-semibold mb-1">
                Subscribe to our newsletter
              </h3>
              <p className="text-sm text-muted-foreground">
                Get the latest updates on new tutors and learning resources.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-muted/50 border-border text-foreground placeholder:text-muted-foreground w-full md:w-64"
              />
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
              >
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Help Center
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Support
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Status
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
