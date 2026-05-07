export interface IReview {
  id: string;
  studentId: string;
  tutorId: string;
  bookingId: string;
  rating: number;
  comment: string;
  isDeleted: boolean;
  deletedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  Student?: {
    User?: {
      name: string;
      profileImage?: string | null;
    };
  };
}

export interface IReviewCreateInput {
  tutorId: string;
  bookingId: string;
  rating: number;
  comment: string;
}

export interface IReviewUpdateInput {
  rating?: number;
  comment?: string;
}
