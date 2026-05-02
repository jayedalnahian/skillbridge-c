import DashboardNavbar from "@/components/modules/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/modules/dashboard/DashboardSidebar";
import { getUserInfo } from "@/services/auth.service";
import { redirect } from "next/navigation";

export default async function DashboardRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const userInfo = await getUserInfo();

  if (!userInfo) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - Desktop */}
      <DashboardSidebar userInfo={userInfo} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <DashboardNavbar userInfo={userInfo} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
