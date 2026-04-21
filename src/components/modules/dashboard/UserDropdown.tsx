"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@/types/user.types";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { logoutAction } from "../../navbar/logoutAction";

interface UserDropdownProps {
  userInfo: User;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const handleLogout = async () => {
    await logoutAction();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-accent/80 transition-all duration-200 outline-none group">
          <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/30 transition-colors duration-200">
            <AvatarImage src="" />
            <AvatarFallback className="bg-gradient-to-br from-[#00ADB5] to-[#008f96] text-white font-bold">
              {userInfo.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start leading-tight">
            <span className="text-sm font-semibold">{userInfo.name}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {userInfo.role.toLocaleLowerCase().replace("_", " ")}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2 mt-2" align="end">
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none">{userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-accent py-2 px-3">
            <UserIcon className="mr-2 h-4 w-4 text-[#00ADB5]" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-accent py-2 px-3">
            <Settings className="mr-2 h-4 w-4 text-[#00ADB5]" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="rounded-lg cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10 py-2 px-3 m-1"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
