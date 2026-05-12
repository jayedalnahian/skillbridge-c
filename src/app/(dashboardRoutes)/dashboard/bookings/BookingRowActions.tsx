"use client";

import { useState } from "react";
import { 
  MoreHorizontal, 
  Eye, 
  CreditCard,
  XCircle,
  Video,
  CheckCircle
} from "lucide-react";
import { Row, Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useBookingMutations } from "@/hooks/useBookingMutations";
import { IBooking } from "@/types/booking.types";
import { BookingDetailsView } from "@/components/modules/dashboard/admin/bookings/BookingDetailsView";
import { SmartForm, FormField } from "@/components/shared/data-form/data-form";
import { z } from "zod";

import { RatingInput } from "@/components/shared/data-form/RatingInput";

const cancelSchema = z.object({
  cancelReason: z.string().min(1, "Reason is required"),
});

const completeSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating cannot exceed 5"),
  comment: z.string().optional(),
});

interface BookingRowActionsProps {
  row: Row<IBooking>;
  table: Table<IBooking>;
}

export function BookingRowActions({ row }: BookingRowActionsProps) {
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCompleteOpen, setIsCompleteOpen] = useState(false);
  
  const { changeStatusMutation, completeMutation } = useBookingMutations();
  const booking = row.original;

  const handlePayNow = () => {
    if (booking.paymentUrl) {
      window.location.href = booking.paymentUrl;
    }
  };

    const handleJoinMeeting = () => {
    if (booking.meetingLink) {
      window.location.href = booking.meetingLink;
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          {booking.paymentStatus === "UNPAID" && booking.status === "PENDING" && booking.paymentUrl && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlePayNow} className="text-blue-600 font-semibold">
                <CreditCard className="mr-2 h-4 w-4" />
                Pay Now
              </DropdownMenuItem>
            </>
          )}

          {booking.meetingLink && booking.status !== "REJECTED" && booking.status !== "COMPLETED" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleJoinMeeting} className="text-blue-600 font-semibold">
                <Video className="mr-2 h-4 w-4" />
                Join Meeting
              </DropdownMenuItem>
            </>
          )}

          {booking.status === "ACCEPTED" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCompleteOpen(true)} className="text-green-600 font-semibold">
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Booking
              </DropdownMenuItem>
            </>
          )}


          {booking.status === "PENDING" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCancelOpen(true)} className="text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Booking
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* View Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          <BookingDetailsView item={booking as any} />
        </DialogContent>
      </Dialog>

      {/* Cancel Modal with SmartForm */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this booking? Please provide a reason.
            </DialogDescription>
          </DialogHeader>
          <SmartForm
            schema={cancelSchema}
            mutation={changeStatusMutation as any}
            defaultValues={{ cancelReason: "" }}
            transform={(value) => ({
              id: booking.id,
              payload: {
                status: "REJECTED", // Using REJECTED as there's no CANCELLED status in enum
                cancelReason: value.cancelReason,
              },
            })}
            onSuccess={() => setIsCancelOpen(false)}
            submitLabel="Confirm Cancellation"
          >
            {(form) => (
              <FormField
                form={form}
                name="cancelReason"
                label="Reason for Cancellation"
                placeholder="e.g. Change of plans, found another tutor"
              />
            )}
          </SmartForm>
        </DialogContent>
      </Dialog>

      {/* Complete Modal with SmartForm */}
      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Booking & Leave a Review</DialogTitle>
            <DialogDescription>
              Mark this session as completed and share your feedback about the tutor.
            </DialogDescription>
          </DialogHeader>
          <SmartForm
            schema={completeSchema}
            mutation={completeMutation as any}
            defaultValues={{ rating: 5, comment: "" }}
            transform={(value) => ({
              id: booking.id,
              payload: {
                tutorId: booking.tutorId,
                bookingId: booking.id,
                rating: value.rating,
                comment: value.comment || "",
              },
            })}
            onSuccess={() => setIsCompleteOpen(false)}
            submitLabel="Complete & Submit Review"
          >
            {(form) => (
              <div className="space-y-4">
                <FormField
                  form={form}
                  name="rating"
                  label="Rating"
                  render={(field) => (
                    <div className="flex flex-col gap-2">
                      <RatingInput
                        value={field.state.value}
                        onChange={(val) => field.handleChange(val)}
                      />
                      <p className="text-xs text-slate-500 font-medium">
                        {field.state.value} of 5 Stars
                      </p>
                    </div>
                  )}
                />
                <FormField
                  form={form}
                  name="comment"
                  label="Review Comment (Optional)"
                  placeholder="How was your session?"
                />
              </div>
            )}
          </SmartForm>
        </DialogContent>
      </Dialog>
    </>
  );
}


