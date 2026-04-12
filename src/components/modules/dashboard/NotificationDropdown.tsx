"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const notifications = [
  {
    id: 1,
    title: "New Booking Request",
    description: "John Doe wants to book a session for Physics.",
    time: "5m ago",
    unread: true,
  },
  {
    id: 2,
    title: "Payment Received",
    description: "Your payout of $150 has been processed.",
    time: "1h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Profile Viewed",
    description: "4 new students viewed your profile this week.",
    time: "2h ago",
    unread: false,
  },
];

const NotificationDropdown = () => {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl border border-border/60 hover:bg-accent/80 transition-all duration-200"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#00ADB5] text-[10px] font-bold text-white ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[320px] p-0 mt-2" align="end">
        <DropdownMenuLabel className="p-4 flex items-center justify-between">
          <span className="font-bold">Notifications</span>
          <Button variant="ghost" size="sm" className="h-8 text-[11px] text-[#00ADB5] hover:text-[#00ADB5] hover:bg-[#00ADB5]/10">
            Mark all as read
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="m-0" />
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-accent/80 rounded-none border-b border-border/40 last:border-0"
              >
                <div className="flex items-center justify-between w-full gap-2">
                  <span className={`text-sm font-semibold ${n.unread ? "text-foreground" : "text-muted-foreground"}`}>
                    {n.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {n.description}
                </p>
                {n.unread && (
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00ADB5]" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
          <Button variant="ghost" className="w-full text-xs font-medium text-muted-foreground hover:bg-accent/80">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
