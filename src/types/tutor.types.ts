import { DaysOfWeek } from "./user.types";

export interface ITutor {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber: string;
  availabilityStartTime: string | Date;
  availabilityEndTime: string | Date;
  availableDays: DaysOfWeek[];
  status: string;
  experienceYears: number;
  educationLevel: string;
  avgRating: number;
  hourlyRate: number;
  designation: string;
  isDeleted: boolean;
  deletedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ITutorWithRelations extends ITutor {
  User?: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    emailVerified: boolean;
    image?: string | null;
    isDeleted: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  tutorCategory?: {
    categoryId: string;
    Category?: {
      id: string;
      name: string;
      slug: string;
    };
  }[];
  reviews?: unknown[];
  bookings?: unknown[];
}

export interface ITutorQueryParams {
  page?: string;
  limit?: string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: string;
  name?: string;
  email?: string;
  educationLevel?: string;
  isDeleted?: string;
}

export interface ITutorCreateInput {
  password: string;
  tutor: {
    name: string;
    email: string;
    contactNumber: string;
    profilePhoto?: string;
    designation: string;
    educationLevel: string;
    experienceYears: number;
    hourlyRate: number;
    availableDays: DaysOfWeek[];
    availabilityStartTime: string;
    availabilityEndTime: string;
  };
  categories: string[];
}

export interface ITutorUpdateInput {
  name?: string;
  email?: string;
  contactNumber?: string;
  profilePhoto?: string;
  designation?: string;
  educationLevel?: string;
  experienceYears?: number;
  hourlyRate?: number;
  availableDays?: DaysOfWeek[];
  availabilityStartTime?: string;
  availabilityEndTime?: string;
}

// Dashboard Analytics Types

export interface ITutorBookingStatusDistribution {
  status: string;
  count: number;
}

export interface ITutorPaymentStatusDistribution {
  status: string;
  count: number;
}

export interface ITutorMonthlyBookings {
  month: string;
  bookings: number;
}

export interface ITutorMonthlyEarnings {
  month: string;
  earnings: number;
}

export interface ITutorUpcomingSession {
  id: string;
  studentName: string;
  subject: string;
  startDateTime: string;
  duration: number;
  meetingLink: string | null;
}

export interface ITutorTopStudent {
  id: string;
  name: string;
  totalSessions: number;
  totalPaid: number;
}

export interface ITutorRatingDistribution {
  rating: number;
  count: number;
}

export interface ITutorSessionTimeline {
  date: string;
  completed: number;
  upcoming: number;
}

export interface ITutorStats {
  totalBookings: number;
  completedSessions: number;
  upcomingSessions: number;
  totalEarnings: number;
  averageRating: number | null;
  totalReviews: number;
  uniqueStudents: number;
  totalHoursTaught: number;
  hourlyRate: number;
}

export interface ITutorDashboardData {
  pieCharts: {
    bookingStatusDistribution: ITutorBookingStatusDistribution[];
    paymentStatusDistribution: ITutorPaymentStatusDistribution[];
    ratingDistribution: ITutorRatingDistribution[];
  };
  barCharts: {
    monthlyBookings: ITutorMonthlyBookings[];
    monthlyEarnings: ITutorMonthlyEarnings[];
  };
  lineCharts: {
    sessionTimeline: ITutorSessionTimeline[];
  };
  upcomingSessions: ITutorUpcomingSession[];
  topStudents: ITutorTopStudent[];
  stats: ITutorStats;
}
