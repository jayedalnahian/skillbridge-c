"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, Loader2, ArrowLeft, BookOpen, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const bookingId = searchParams.get("booking_id");

  const handleRetryPayment = async () => {
    if (!bookingId) {
      toast.error("No booking found");
      return;
    }

    setIsRetrying(true);
    
    // In production, call your backend to get a new checkout URL
    // const result = await retryPayment(bookingId);
    
    toast.info("Redirecting to payment...");
    
    // Simulate delay then redirect
    setTimeout(() => {
      setIsRetrying(false);
      // router.push(result.checkoutUrl);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8 pb-8">
            {/* Cancel Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-amber-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Payment Cancelled
              </h1>
              <p className="text-slate-600">
                Your payment was not completed. Your booking is still pending.
              </p>
            </div>

            {/* Booking Info */}
            {bookingId && (
              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
                  Booking Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Booking ID</span>
                    <span className="font-mono text-sm text-slate-900">
                      {bookingId.slice(0, 8)}...
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      Pending Payment
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Options */}
            <div className="space-y-4 mb-8">
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  What would you like to do?
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Complete payment now to confirm your booking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Pay later from your bookings dashboard</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Your booking will be held for 24 hours</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {bookingId && (
                <Button
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  className="flex-1 bg-[#00ADB5] hover:bg-[#008f96]"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Payment Again
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/bookings")}
                className="flex-1"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View My Bookings
              </Button>
            </div>

            {/* Back Link */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="w-full mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>

        {/* Support Section */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Having trouble?{" "}
          <a href="/contact" className="text-[#00ADB5] hover:underline">
            Contact our support team
          </a>
        </p>
      </div>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#00ADB5] mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
