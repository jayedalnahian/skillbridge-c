"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { getIconComponent } from "@/lib/iconMapper";

import { cn } from "@/lib/utils"
import { NavSection } from "@/types/dashboard.types"
import { User as UserType } from "@/types/user.types";
import { ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"


interface DashboardSidebarContentProps {
    userInfo : UserType,
    navItems : NavSection[],
    dashboardHome : string,
}


const DashboardSidebarContent = ({dashboardHome, navItems, userInfo} : DashboardSidebarContentProps) => {
    const pathname = usePathname()
  return (
    <div className="hidden md:flex h-full w-64 flex-col overflow-y-auto bg-[#222831]">
      {/* Logo / Brand */}
      <div className="flex h-20 py-3 items-center px-6 border-b border-[#393E46]">
        <Link href={dashboardHome} className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00ADB5] to-[#008f96] flex items-center justify-center shadow-lg shadow-[#00ADB5]/25">
            <GraduationCap className="text-[#EEEEEE] w-6 h-6" />
          </div>
          <span className="text-lg font-bold text-[#EEEEEE]">
            SkillBridge
          </span>
        </Link>
      </div>

      {/* Navigation Area */}
      <ScrollArea className="flex-1 px-3 py-5">
        <nav className="space-y-6">
          {navItems?.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-3 px-3 text-[11px] font-semibold text-[#EEEEEE]/50 uppercase tracking-[0.15em]">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathname === item.href;
                  const Icon = getIconComponent(item.icon);

                  return (
                    <Link
                      href={item.href}
                      key={id}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-gradient-to-r from-[#00ADB5] to-[#008f96] text-[#EEEEEE] shadow-lg shadow-[#00ADB5]/25"
                          : "text-[#EEEEEE]/70 hover:bg-[#393E46] hover:text-[#EEEEEE]",
                      )}
                    >
                      <Icon className={cn(
                        "w-[18px] h-[18px] transition-transform duration-200",
                        !isActive && "group-hover:scale-110"
                      )} />
                      <span className="flex-1">{item.title}</span>
                      {isActive && <ChevronRight className="w-4 h-4 opacity-60" />}
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <div className="my-4 mx-3 h-px bg-[#393E46]" />
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info At Bottom */}
      <div className="border-t border-[#393E46] px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-[#393E46] transition-colors duration-200 cursor-pointer">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#00ADB5] to-[#008f96] flex items-center justify-center ring-2 ring-[#00ADB5]/20 shadow-lg shadow-[#00ADB5]/20">
            <span className="text-sm font-bold text-[#EEEEEE]">
              {userInfo.name?.charAt(0).toUpperCase()}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-[#EEEEEE] truncate">{userInfo.name}</p>
            <p className="text-xs text-[#EEEEEE]/60 capitalize whitespace-nowrap overflow-hidden text-ellipsis">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardSidebarContent