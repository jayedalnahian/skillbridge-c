export interface IBooking {
  id: string;
  studentId: string;
  tutorId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED";
  price: number;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface IBookingQueryParams {
  searchTerm?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
  paymentStatus?: string;
  isDeleted?: boolean;
}

export interface IBookingCreateInput {
  startDateTime: string | Date;
  endDateTime: string | Date;
}

export interface ICancelBookingInput {
  cancelReason: string;
}
