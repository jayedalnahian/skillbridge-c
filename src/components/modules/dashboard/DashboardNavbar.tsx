import { getDefaultDashboardRoute } from "@/lib/authUtils"
import { getNavItemsByRole } from "@/lib/navItems"
import { NavSection } from "@/types/dashboard.types"
import { User as UserType } from "@/types/user.types"
import DashboardNavbarContent from "./DashboardNavbarContent"

const DashboardNavbar = ({ userInfo }: { userInfo: UserType }) => {
  const navItems: NavSection[] = getNavItemsByRole(userInfo.role)
  const dashboardHome = getDefaultDashboardRoute(userInfo.role)



  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  )
}

export default DashboardNavbar