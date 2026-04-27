import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillBridge - Connect with Expert Tutors",
  description: "Find and book sessions with expert tutors in programming, design, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
