import { getUserInfo } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/authUtils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  GraduationCap,
  Clock,
  DollarSign,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { UserInfo } from "@/types/user.types";

// Role badge color mapping
const getRoleBadgeVariant = (role: UserRole) => {
  switch (role) {
    case UserRole.ADMIN:
      return "default";
    case UserRole.TUTOR:
      return "secondary";
    case UserRole.STUDENT:
      return "outline";
    default:
      return "outline";
  }
};

// Status badge styling
const getStatusBadgeStyle = (status: string) => {
  return status === "ACTIVE"
    ? "bg-green-100 text-green-800 border-green-200"
    : "bg-red-100 text-red-800 border-red-200";
};

// Format time from Date
const formatTime = (date: string | Date) => {
  return format(new Date(date), "h:mm a");
};

// Info row component
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 py-2.5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00ADB5]/10">
      <Icon className="h-4 w-4 text-[#00ADB5]" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <div className="text-sm font-medium text-slate-900 mt-0.5">{value}</div>
    </div>
  </div>
);

// Profile Header Component
const ProfileHeader = ({ user }: { user: UserInfo }) => {
  const profilePhoto =
    user.tutor?.profilePhoto ||
    user.admin?.profilePhoto ||
    user.student?.profilePhoto ||
    user.image ||
    null;

  const displayName =
    user.tutor?.name || user.admin?.name || user.student?.name || user.name;

  const displayEmail =
    user.tutor?.email || user.admin?.email || user.student?.email || user.email;

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-6">
      <Avatar size="lg" className="h-24 w-24 ring-4 ring-[#00ADB5]/20">
        <AvatarImage src={profilePhoto || undefined} alt={displayName} />
        <AvatarFallback className="text-2xl bg-[#00ADB5] text-white">
          {displayName?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-slate-900">{displayName}</h1>
          <div className="flex items-center gap-2">
            <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
              {user.role.toLowerCase()}
            </Badge>
            <Badge
              variant="outline"
              className={`capitalize ${getStatusBadgeStyle(user.status)}`}
            >
              {user.status.toLowerCase()}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-slate-600">
          <span className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-slate-400" />
            {displayEmail}
          </span>
          {user.emailVerified && (
            <span className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Verified
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Account Information Card
const AccountInfoCard = ({ user }: { user: UserInfo }) => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5 text-[#00ADB5]" />
        Account Information
      </CardTitle>
      <CardDescription>Your account details and security status</CardDescription>
    </CardHeader>
    <CardContent className="pt-0">
      <InfoRow icon={User} label="User ID" value={user.id} />
      <Separator />
      <InfoRow icon={Shield} label="Role" value={user.role} />
      <Separator />
      <InfoRow
        icon={user.status === "ACTIVE" ? CheckCircle2 : XCircle}
        label="Account Status"
        value={
          <Badge
            variant="outline"
            className={`capitalize ${getStatusBadgeStyle(user.status)}`}
          >
            {user.status.toLowerCase()}
          </Badge>
        }
      />
      <Separator />
      <InfoRow
        icon={Calendar}
        label="Member Since"
        value={format(new Date(user.createdAt), "MMMM d, yyyy")}
      />
      <Separator />
      <InfoRow
        icon={Calendar}
        label="Last Updated"
        value={format(new Date(user.updatedAt), "MMMM d, yyyy")}
      />
    </CardContent>
  </Card>
);

// Admin Profile Card
const AdminProfileCard = ({ admin }: { admin: UserInfo["admin"] }) => {
  if (!admin) return null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#00ADB5]" />
          Admin Profile
        </CardTitle>
        <CardDescription>Your administrator information</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow icon={User} label="Name" value={admin.name} />
        <Separator />
        <InfoRow icon={Mail} label="Email" value={admin.email} />
        <Separator />
        <InfoRow icon={Phone} label="Contact Number" value={admin.contactNumber} />
        <Separator />
        <InfoRow icon={MapPin} label="Address" value={admin.address} />
      </CardContent>
    </Card>
  );
};

// Student Profile Card
const StudentProfileCard = ({ student }: { student: UserInfo["student"] }) => {
  if (!student) return null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#00ADB5]" />
          Student Profile
        </CardTitle>
        <CardDescription>Your student information and bio</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow icon={User} label="Name" value={student.name} />
        <Separator />
        <InfoRow icon={Mail} label="Email" value={student.email} />
        <Separator />
        <InfoRow
          icon={Phone}
          label="Contact Number"
          value={student.contactNumber || "Not provided"}
        />
        <Separator />
        <div className="flex items-start gap-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00ADB5]/10">
            <User className="h-4 w-4 text-[#00ADB5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500 uppercase tracking-wide">About</p>
            <div className="text-sm font-medium text-slate-900 mt-0.5">
              {student.description || "No description provided"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Tutor Profile Card
const TutorProfileCard = ({ tutor }: { tutor: UserInfo["tutor"] }) => {
  if (!tutor) return null;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#00ADB5]" />
          Tutor Profile
        </CardTitle>
        <CardDescription>Your tutoring information and expertise</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow icon={User} label="Name" value={tutor.name} />
        <Separator />
        <InfoRow icon={Mail} label="Email" value={tutor.email} />
        <Separator />
        <InfoRow icon={Phone} label="Contact Number" value={tutor.contactNumber} />
        <Separator />
        <InfoRow icon={Award} label="Designation" value={tutor.designation} />
        <Separator />
        <InfoRow icon={GraduationCap} label="Education Level" value={tutor.educationLevel} />
        <Separator />
        <InfoRow icon={Clock} label="Experience" value={`${tutor.experienceYears} years`} />
        <Separator />
        <InfoRow
          icon={DollarSign}
          label="Hourly Rate"
          value={`$${tutor.hourlyRate.toFixed(2)}`}
        />
        <Separator />
        <InfoRow
          icon={Clock}
          label="Availability"
          value={`${formatTime(tutor.availabilityStartTime)} - ${formatTime(tutor.availabilityEndTime)}`}
        />
        <Separator />
        <InfoRow
          icon={Calendar}
          label="Available Days"
          value={tutor.availableDays.join(", ")}
        />
      </CardContent>
    </Card>
  );
};

// Main Profile Page
const MyProfilePage = async () => {
  const user = await getUserInfo();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">My Profile</h2>
        <p className="text-slate-600 mt-1">
          View and manage your personal information and account details
        </p>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <ProfileHeader user={user} />
        </CardContent>
      </Card>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Account Info */}
        <AccountInfoCard user={user} />

        {/* Right Column - Role-Specific Info */}
        {user.role === UserRole.ADMIN && user.admin && (
          <AdminProfileCard admin={user.admin} />
        )}
        {user.role === UserRole.STUDENT && user.student && (
          <StudentProfileCard student={user.student} />
        )}
        {user.role === UserRole.TUTOR && user.tutor && (
          <TutorProfileCard tutor={user.tutor} />
        )}
      </div>
    </div>
  );
};

export default MyProfilePage;