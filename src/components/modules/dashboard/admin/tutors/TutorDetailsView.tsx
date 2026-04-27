"use client";

import { ITutorWithRelations } from "@/types/tutor.types";
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
  Briefcase,
  GraduationCap,
  DollarSign,
  Clock3,
  User,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { DaysOfWeek } from "./tutorTypes";
import Link from "next/link";
import { UniversalDateTimePicker } from "@/components/shared/date-time-picker/universal-datetime-picker";

interface TutorDetailsViewProps {
  item: ITutorWithRelations;
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

const formatTime = (timeValue: string | Date) => {
  if (!timeValue) return "N/A";
  if (typeof timeValue === "string") {
    return timeValue.slice(0, 5); // Extract HH:mm from "HH:mm:ss"
  }
  return timeValue.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const DAYS_MAP: Record<DaysOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue",
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun",
};

export function TutorDetailsView({ item }: TutorDetailsViewProps) {
  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  const handleCopy = (text: string) => {
    copyText(text);
  };

  const createdAt = formatDate(item.createdAt);
  const updatedAt = formatDate(item.updatedAt);

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
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{item.name}</h3>
            <p className="text-sm text-slate-500 truncate">{item.designation}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            asChild
            className="text-[#00ADB5] border-[#00ADB5] hover:bg-[#00ADB5]/10"
          >
            <Link href={`/all-tutors/${item.id}`}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Profile
            </Link>
          </Button>
          <Badge
            variant={item.isDeleted ? "destructive" : "secondary"}
            className="h-6"
          >
            {item.isDeleted ? "Deleted" : item.status}
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
              <span className="text-sm text-slate-700 truncate">{item.email}</span>
            </div>
          </div>
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Contact Number
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-white min-w-0">
              <Phone className="h-4 w-4 text-[#00ADB5] shrink-0" />
              <span className="text-sm text-slate-700 truncate">{item.contactNumber}</span>
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Education
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-white min-w-0">
              <GraduationCap className="h-4 w-4 text-[#00ADB5] shrink-0" />
              <span className="text-sm text-slate-700 truncate">{item.educationLevel}</span>
            </div>
          </div>
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Experience
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-white min-w-0">
              <Briefcase className="h-4 w-4 text-[#00ADB5] shrink-0" />
              <span className="text-sm text-slate-700 truncate">{item.experienceYears} years</span>
            </div>
          </div>
          <div className="space-y-2 min-w-0">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Hourly Rate
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-100 bg-white min-w-0">
              <DollarSign className="h-4 w-4 text-[#00ADB5] shrink-0" />
              <span className="text-sm text-slate-700 truncate">${item.hourlyRate}/hr</span>
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Availability
          </Label>
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 space-y-3">
            {/* Available Days */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex items-center gap-2 shrink-0">
                <Clock3 className="h-4 w-4 text-[#00ADB5]" />
                <span className="text-sm font-medium text-slate-700">Available Days:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {item.availableDays?.map((day) => (
                  <Badge
                    key={day}
                    variant="secondary"
                    className="text-xs bg-[#00ADB5]/10 text-[#00ADB5] hover:bg-[#00ADB5]/20"
                  >
                    {DAYS_MAP[day as DaysOfWeek] || day}
                  </Badge>
                ))}
              </div>
            </div>
            {/* Time Range */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-sm text-slate-600">Available Hours:</span>
              </div>
              <div className="flex items-center gap-2">
                <UniversalDateTimePicker
                  mode="time"
                  isReadOnly
                  value={item.availabilityStartTime}
                />
                <span className="text-slate-400">-</span>
                <UniversalDateTimePicker
                  mode="time"
                  isReadOnly
                  value={item.availabilityEndTime}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Categories */}
        {item.tutorCategory && item.tutorCategory.length > 0 && (
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Categories
            </Label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border border-slate-100 bg-white">
              <BookOpen className="h-4 w-4 text-[#00ADB5] shrink-0" />
              <div className="flex flex-wrap gap-1">
                {item.tutorCategory.map((tc) => (
                  <Badge key={tc.categoryId} variant="outline" className="text-xs">
                    {tc.Category?.name || tc.categoryId}
                  </Badge>
                ))}
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
              Tutor ID
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
