"use client";

import { useState } from "react";
import { 
  Check, 
  MoreHorizontal, 
  X, 
  Eye, 

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

const rejectSchema = z.object({
  cancelReason: z.string().min(1, "Reason is required"),
});

interface BookingRowActionsProps {
  row: Row<IBooking>;
  table: Table<IBooking>;
}

export function BookingRowActions({ row }: BookingRowActionsProps) {
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const { changeStatusMutation, hardDeleteMutation } = useBookingMutations();
  const booking = row.original;

  const handleAccept = () => {
    changeStatusMutation.mutate({
      id: booking.id,
      payload: { status: "ACCEPTED" },
    });
  };

  const handleReject = (data: { cancelReason: string }) => {
    changeStatusMutation.mutate({
      id: booking.id,
      payload: { 
        status: "REJECTED", 
        cancelReason: data.cancelReason 
      },
    }, {
      onSuccess: () => setIsRejectOpen(false)
    });
  };

  const handlePermanentDelete = () => {
    hardDeleteMutation.mutate(booking.id, {
      onSuccess: () => setIsDeleteOpen(false)
    });
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
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          
          {booking.status === "PENDING" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAccept} className="text-green-600">
                <Check className="mr-2 h-4 w-4" />
                Accept Booking
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsRejectOpen(true)} className="text-amber-600">
                <X className="mr-2 h-4 w-4" />
                Reject Booking
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

      {/* Reject Modal with SmartForm */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Booking</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting this booking request.
            </DialogDescription>
          </DialogHeader>
          <SmartForm
            schema={rejectSchema}
            mutation={changeStatusMutation as any}
            defaultValues={{ cancelReason: "" }}
            transform={(value) => ({
              id: booking.id,
              payload: {
                status: "REJECTED",
                cancelReason: value.cancelReason,
              },
            })}
            onSuccess={() => setIsRejectOpen(false)}
            submitLabel="Reject Booking"
          >
            {(form) => (
              <FormField
                form={form}
                name="cancelReason"
                label="Cancellation Reason"
                placeholder="e.g. Schedule conflict"
              />
            )}
          </SmartForm>
        </DialogContent>
      </Dialog>

     
    </>
  );
}
