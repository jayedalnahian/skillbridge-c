import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#222831] px-6 text-center">
      {/* Brand Icon */}
      <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00ADB5] to-[#008f96] shadow-2xl shadow-[#00ADB5]/20 animate-in fade-in zoom-in duration-500">
        <GraduationCap className="h-10 w-10 text-[#EEEEEE]" />
      </div>

      {/* Hero Text */}
      <h1 className="mb-2 text-9xl font-black tracking-tighter text-[#EEEEEE]/10 select-none">
        404
      </h1>
      <h2 className="relative -mt-16 text-4xl font-bold text-[#EEEEEE]">
        Lost in Learning?
      </h2>
      <p className="mt-4 max-w-md text-lg text-[#EEEEEE]/60">
        We couldn't find the page you're looking for. It might have been moved, deleted, or never existed in the first place.
      </p>

      {/* Actions */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <Button
          asChild
          className="h-12 rounded-xl bg-[#00ADB5] px-8 text-base font-semibold text-[#EEEEEE] hover:bg-[#00ADB5]/90"
        >
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="h-12 rounded-xl border-[#393E46] bg-transparent px-8 text-base font-semibold text-[#EEEEEE] hover:bg-[#393E46] hover:text-[#EEEEEE]"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Previous Page
        </Button>
      </div>

      {/* Decorative Elements */}
      <div className="fixed bottom-0 left-0 -z-10 h-[30vh] w-full bg-gradient-to-t from-[#00ADB5]/5 to-transparent" />
      <div className="fixed top-20 right-20 -z-10 h-64 w-64 rounded-full bg-[#00ADB5]/5 blur-3xl" />
    </div>
  );
}
