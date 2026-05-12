export interface IBooking {
  id: string;
  studentId: string;
  tutorId: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED";
  price: number;
  isDeleted: boolean;
  createdAt?: string;
  updatedAt?: string;
  paymentUrl?: string;
  meetingLink?: string;
  Student?: {
    id: string;
    name: string;
    email: string;
  };
  Tutor?: {
    id: string;
    name: string;
    email: string;
  };
  payment?: {
    id: string;
    amount: number;
    transactionId: string;
    status: string;
  };
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

export interface IChangeBookingStatusInput {
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "COMPLETED";
  cancelReason?: string;
  
}

