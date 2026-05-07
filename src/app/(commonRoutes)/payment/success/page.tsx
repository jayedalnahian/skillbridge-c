"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, Calendar, Clock, DollarSign, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { verifyPayment } from "@/services/booking.service";

interface PaymentDetails {
  id: string;
  amount: number;
  status: string;
  bookingId: string;
  sessionDate: string;
  sessionTime: string;
  duration: number;
  tutorName: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    const verifyAndUpdate = async () => {
      if (!sessionId && !paymentId) {
        setError("No payment session found");
        setIsLoading(false);
        return;
      }

      // If we have a session_id, verify the payment with the backend
      // This updates the payment status in the database
      if (sessionId) {
        console.log("[PaymentSuccess] Verifying payment:", sessionId);
        const result = await verifyPayment(sessionId);
        console.log("[PaymentSuccess] Verification result:", result);

        if (result.success) {
          toast.success("Payment verified and confirmed!");
        } else {
          console.warn("[PaymentSuccess] Verification warning:", result.message);
          // Still show success page, but warn that verification had issues
          toast.info("Payment may still be processing");
        }
      }

      setIsLoading(false);
    };

    verifyAndUpdate();
  }, [sessionId, paymentId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00ADB5] mx-auto mb-4" />
          <p className="text-slate-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              Payment Not Found
            </h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button
              onClick={() => router.push("/dashboard/bookings")}
              className="bg-[#00ADB5] hover:bg-[#008f96]"
            >
              View My Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8 pb-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Payment Successful!
              </h1>
              <p className="text-slate-600">
                Your booking has been confirmed and payment received.
              </p>
            </div>

            {/* Session Details */}
            <div className="bg-slate-50 rounded-lg p-6 mb-6">
              <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
                Payment Details
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <DollarSign className="h-4 w-4" />
                    <span>Amount Paid</span>
                  </div>
                  <span className="font-semibold text-slate-900">
                    ${paymentDetails?.amount ? (paymentDetails.amount / 100).toFixed(2) : "--"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="h-4 w-4" />
                    <span>Payment Date</span>
                  </div>
                  <span className="font-medium text-slate-900">
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-sm">Status</span>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Paid
                  </span>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-3">
                What happens next?
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>You&apos;ll receive a confirmation email shortly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>The tutor has been notified of your booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Join the session at the scheduled time</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push("/dashboard/bookings")}
                className="flex-1 bg-[#00ADB5] hover:bg-[#008f96]"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View My Bookings
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/all-tutors")}
                className="flex-1"
              >
                Find More Tutors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support Section */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Need help?{" "}
          <a href="/contact" className="text-[#00ADB5] hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00ADB5] mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
