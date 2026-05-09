import { UserRole } from "@/lib/authUtils";

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

export enum TutorStatus {
  ACTIVE = "ACTIVE",
  BANNED = "BANNED",
}

export type DaysOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export interface ITutor {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  availabilityStartTime: string; // HH:mm format
  availabilityEndTime: string;   // HH:mm format
  availableDays: DaysOfWeek[];
  status: TutorStatus;
  experienceYears: number;
  educationLevel: string;
  hourlyRate: number;
  designation: string;
  isDeleted: boolean;
  deletedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IStudent {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  description?: string | null;
  isDeleted: boolean;
  deletedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface IAdmin {
  id: string;
  userId: string;
  name: string;
  email: string;
  profilePhoto: string;
  contactNumber: string;
  address: string;
  isDeleted: boolean;
  deletedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type UserProfile = ITutor | IStudent | IAdmin;

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: UserRole;
  status: UserStatus;
  needPasswordChange: boolean;
  isDeleted: boolean;
  deletedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;

  // Relations
  tutor?: ITutor | null;
  admin?: IAdmin | null;
  student?: IStudent | null;

  // Optional/Computed fields
  loginAttempts?: number;
  lockUntil?: string | null;
}

export type UserInfo = User;

export interface IStudentUpdatePayload {
  name?: string;
  email?: string;
  profilePhoto?: string;
  contactNumber?: string;
  description?: string;
}
