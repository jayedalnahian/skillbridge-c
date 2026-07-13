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

// Format time from HH:mm string to 12-hour format (e.g., "10:19 PM")
const formatTime = (time: string) => {
  // Parse "HH:mm" format
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

// Info row component
const InfoRow = ({
  icon: Icon,
  label,
  value,
  isLast = false,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}) => (
  <div className={`flex items-start gap-3 py-3 px-1 rounded-lg transition-colors hover:bg-muted/30 ${!isLast ? "border-b border-border/50" : ""}`}>
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
      <div className="text-sm font-medium text-foreground mt-0.5">{value}</div>
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
      <div className="relative shrink-0">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-sm animate-pulse-glow" />
        <Avatar size="lg" className="h-24 w-24 ring-4 ring-primary/20 relative">
          <AvatarImage src={profilePhoto || undefined} alt={displayName} />
          <AvatarFallback className="text-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            {displayName?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
          <h1 className="text-2xl font-heading font-bold text-gradient">{displayName}</h1>
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

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Mail className="h-4 w-4 text-muted-foreground/60" />
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
  <Card className="h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-heading font-semibold flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        Account Information
      </CardTitle>
      <CardDescription>Your account details and security status</CardDescription>
    </CardHeader>
    <CardContent className="pt-0">
      <InfoRow icon={User} label="User ID" value={user.id} />
      <InfoRow icon={Shield} label="Role" value={user.role} />
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
      <InfoRow
        icon={Calendar}
        label="Member Since"
        value={format(new Date(user.createdAt), "MMMM d, yyyy")}
      />
      <InfoRow
        icon={Calendar}
        label="Last Updated"
        value={format(new Date(user.updatedAt), "MMMM d, yyyy")}
        isLast
      />
    </CardContent>
  </Card>
);

// Admin Profile Card
const AdminProfileCard = ({ admin }: { admin: UserInfo["admin"] }) => {
  if (!admin) return null;

  return (
    <Card className="h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Admin Profile
        </CardTitle>
        <CardDescription>Your administrator information</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow icon={User} label="Name" value={admin.name} />
        <InfoRow icon={Mail} label="Email" value={admin.email} />
        <InfoRow icon={Phone} label="Contact Number" value={admin.contactNumber} />
        <InfoRow icon={MapPin} label="Address" value={admin.address} isLast />
      </CardContent>
    </Card>
  );
};

// Student Profile Card
const StudentProfileCard = ({ student }: { student: UserInfo["student"] }) => {
  if (!student) return null;

  return (
    <Card className="h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Student Profile
        </CardTitle>
        <CardDescription>Your student information and bio</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow icon={User} label="Name" value={student.name} />
        <InfoRow icon={Mail} label="Email" value={student.email} />
        <InfoRow
          icon={Phone}
          label="Contact Number"
          value={student.contactNumber || "Not provided"}
        />
        <InfoRow
          icon={User}
          label="About"
          value={student.description || "No description provided"}
          isLast
        />
      </CardContent>
    </Card>
  );
};

// Tutor Profile Card
const TutorProfileCard = ({ tutor }: { tutor: UserInfo["tutor"] }) => {
  if (!tutor) return null;

  return (
    <Card className="h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading font-semibold flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Tutor Profile
        </CardTitle>
        <CardDescription>Your tutoring information and expertise</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <InfoRow icon={User} label="Name" value={tutor.name} />
        <InfoRow icon={Mail} label="Email" value={tutor.email} />
        <InfoRow icon={Phone} label="Contact Number" value={tutor.contactNumber} />
        <InfoRow icon={Award} label="Designation" value={tutor.designation} />
        <InfoRow icon={GraduationCap} label="Education Level" value={tutor.educationLevel} />
        <InfoRow icon={Clock} label="Experience" value={`${tutor.experienceYears} years`} />
        <InfoRow
          icon={DollarSign}
          label="Hourly Rate"
          value={`$${tutor.hourlyRate.toFixed(2)}`}
        />
        <InfoRow
          icon={Clock}
          label="Availability"
          value={`${formatTime(tutor.availabilityStartTime)} - ${formatTime(tutor.availabilityEndTime)}`}
        />
        <InfoRow
          icon={Calendar}
          label="Available Days"
          value={tutor.availableDays.join(", ")}
          isLast
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
    <div className="w-full max-w-none px-4 sm:px-6 lg:px-8 py-6 relative">
      {/* Decorative background blobs */}
      <div className="fixed top-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-1/4 -left-32 w-80 h-80 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl animate-float-medium pointer-events-none" />

      <div className="relative z-10">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-heading font-bold text-foreground">My Profile</h2>
          <p className="text-muted-foreground mt-1">
            View and manage your personal information and account details
          </p>
        </div>

        {/* Profile Header Card */}
        <Card className="mb-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
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
    </div>
  );
};

export default MyProfilePage;