"use client";

import { IAdmin } from "@/types/user.types";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarIcon,
  Clock,
  Copy,
  Check,
  Mail,
  Phone,
  User,
  MapPin,
} from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

// Extended admin interface with User relation
interface IAdminWithRelations extends IAdmin {
  User?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    status: string;
    role: string;
    emailVerified: boolean;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
}

interface AdminDetailsViewProps {
  item: IAdminWithRelations;
}

const formatDate = (dateString: string | Date) => {
  if (!dateString) return { date: "N/A", time: "N/A" };
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };
};

export function AdminDetailsView({ item }: AdminDetailsViewProps) {
  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copyText(text);
  };

  const createdAt = formatDate(item.createdAt);
  const updatedAt = formatDate(item.updatedAt);
  const deletedAt = item.deletedAt ? formatDate(item.deletedAt) : null;

  return (
    <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div className="flex items-center gap-3 min-w-0">
          {item.profilePhoto ? (
            <img
              src={item.profilePhoto}
              alt={item.name}
              className="h-12 w-12 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <User className="h-6 w-6 text-slate-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {item.name}
            </h3>
            <p className="text-sm text-slate-500 truncate">{item.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            variant={item.isDeleted ? "destructive" : "secondary"}
            className="h-6"
          >
            {item.isDeleted ? "Deleted" : "Active"}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Email
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-white min-w-0">
              <Mail className="h-4 w-4 text-[#00ADB5] shrink-0" />
              <span className="text-sm text-slate-700 truncate">
                {item.email}
              </span>
            </div>
          </div>
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact Number
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-white min-w-0">
              <Phone className="h-4 w-4 text-[#00ADB5] shrink-0" />
              <span className="text-sm text-slate-700 truncate">
                {item.contactNumber || "Not provided"}
              </span>
            </div>
          </div>
        </div>

        {/* Address */}
        {item.address && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Address
            </Label>
            <div className="p-3 rounded-lg border border-slate-100 bg-white">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-[#00ADB5] shrink-0 mt-0.5" />
                <p className="text-sm text-slate-700">
                  {item.address}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Info (if available) */}
        {item.User && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Account Info
            </Label>
            <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">User ID:</span>
                <span className="font-mono text-xs">{item.User.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">Role:</span>
                <Badge variant="outline" className="text-xs">
                  {item.User.role}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">Status:</span>
                <Badge
                  variant={item.User.status === "ACTIVE" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.User.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="font-medium">Email Verified:</span>
                <span>{item.User.emailVerified ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        )}

        {/* IDs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Admin ID
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={item.id}
                className="font-mono text-xs bg-slate-50/50 h-9 border-slate-200 min-w-0"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(item.id)}
                className="shrink-0 h-9 w-9 border-slate-200 hover:bg-slate-100"
              >
                {hasCopiedRecently ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-500" />
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              User ID
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={item.userId}
                className="font-mono text-xs bg-slate-50/50 h-9 border-slate-200 min-w-0"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleCopy(item.userId)}
                className="shrink-0 h-9 w-9 border-slate-200 hover:bg-slate-100"
              >
                {hasCopiedRecently ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-500" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Deleted Info (if applicable) */}
        {item.isDeleted && deletedAt && (
          <div className="p-3 rounded-lg border border-red-200 bg-red-50/50 space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-red-500">
              Deleted At
            </Label>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-red-700">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span className="font-medium">{deletedAt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-red-500">
                <Clock className="h-3 w-3 opacity-50" />
                <span>{deletedAt.time}</span>
              </div>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Registration
            </Label>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CalendarIcon className="h-3.5 w-3.5 text-[#00ADB5]" />
                <span className="font-medium">{createdAt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="h-3 w-3 opacity-50" />
                <span>{createdAt.time}</span>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg border border-slate-100 bg-white space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Last Update
            </Label>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CalendarIcon className="h-3.5 w-3.5 text-[#00ADB5]" />
                <span className="font-medium">{updatedAt.date}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock className="h-3 w-3 opacity-50" />
                <span>{updatedAt.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
