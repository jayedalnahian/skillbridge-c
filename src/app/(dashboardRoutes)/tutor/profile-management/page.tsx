import { getCurrentTutor } from "@/services/tutor.service";
import { getUserInfo } from "@/services/auth.service";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/authUtils";
import { ProfileManagementClient } from "./ProfileManagementClient";


/**
 * Tutor Profile Management Page
 *
 * Server component that fetches current tutor data and renders the client form.
 * Features:
 * - Profile information editing (name, email, contact, photo)
 * - Professional information editing (designation, education, experience)
 * - Availability management (days, start time, end time)
 * - Grid layout with cards spreading across the screen
 */
const ProfileManagementPage = async () => {
  // Verify user is authenticated and is a tutor
  const user = await getUserInfo();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== UserRole.TUTOR) {
    redirect("/dashboard");
  }

  // Fetch current tutor data
  const tutorResponse = await getCurrentTutor();

  if (!tutorResponse.success || !tutorResponse.data) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
          <p>Error loading tutor data: {tutorResponse.message}</p>
        </div>
      </div>
    );
  }

  const tutor = tutorResponse.data;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Profile Management</h1>
        <p className="text-slate-600 mt-1">
          Update your profile information and availability settings
        </p>
      </div>

      {/* Client Component with Form */}
      <ProfileManagementClient tutor={tutor} />
    </div>
  );
};

export default ProfileManagementPage;