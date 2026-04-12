import { UserRole } from "@/lib/authUtils";

/*
model Tutor {
    id                    String       @id @default(ulid())
    userId                String       @unique
    name                  String
    email                 String       @unique
    profilePhoto          String
    contactNumber         String
    availabilityStartTime DateTime
    availabilityEndTime   DateTime
    availableDays         DaysOfWeek[]
    status                TutorStatus   @default(ACTIVE)
    experienceYears       Int
    educationLevel        String
    hourlyRate            Float
    designation           String
    isDeleted             Boolean      @default(false)
    deletedAt             DateTime?
    createdAt             DateTime     @default(now())
    updatedAt             DateTime     @updatedAt

    //relations
    User            User          @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
    tutorCategory   TutorCategory[]
    
    bookings        Booking[]
    reviews         Review[]


    @@map("tutor")
    @@index([userId], name: "tutor_user_id_idx")
    @@index([isDeleted], name: "tutor_is_deleted_idx")
}

model Student {
    id            String    @id @default(ulid())
    userId        String    @unique
    name          String
    profilePhoto  String?
    contactNumber String?
    description   String?  @db.Text
    isDeleted     Boolean   @default(false)
    deletedAt     DateTime?
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt

    //relations
    User     User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)
    bookings Booking[]
    reviews  Review[]

    @@index([userId], name: "student_user_id_idx")
    @@index([isDeleted], name: "student_is_deleted_idx")
    @@map("student")
}

model Admin {
    id            String    @id @default(uuid())
    userId        String    @unique
    name          String
    email         String    @unique
    profilePhoto  String
    contactNumber String
    address       String
    isDeleted     Boolean   @default(false)
    deletedAt     DateTime?
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt

    //relations
    User User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

    @@index([userId], name: "admin_user_id_idx")
    @@map("admin")
}

model User {
  id                 String     @id
  name               String
  email              String
  emailVerified      Boolean    @default(false)
  image              String?
  role               UserRole   @default(STUDENT)
  status             UserStatus @default(ACTIVE)
  needPasswordChange Boolean    @default(false)
  isDeleted          Boolean    @default(false)
  deletedAt          DateTime?
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt
  sessions           Session[]
  accounts           Account[]
  tutor              Tutor?
  admin              Admin?
  student            Student?

  @@unique([email])
  @@map("user")
}
*/

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
  availabilityStartTime: string | Date;
  availabilityEndTime: string | Date;
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
