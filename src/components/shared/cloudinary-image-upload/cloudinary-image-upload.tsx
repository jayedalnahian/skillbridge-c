"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { CheckCircle, Upload } from "lucide-react";

interface CloudinaryImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onUploadSuccess?: (url: string) => void;
  error?: string;
  label?: string;
  placeholder?: string;
}

export function CloudinaryImageUpload({
  value,
  onChange,
  onUploadSuccess,
  error: externalError,
  placeholder = "https://example.com/photo.jpg",
}: CloudinaryImageUploadProps) {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none  focus:ring-2 focus:ring-[#00ADB5]/40 ${
          uploadError || externalError
            ? "border-destructive focus:ring-destructive"
            : "border-slate-200"
        }`}
      />
      <CldUploadWidget
        uploadPreset={
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "skillbridge"
        }
        onSuccess={(result: any) => {
          const imageUrl = result?.info?.secure_url;

          if (!imageUrl) {
            setUploadError("Unable to retrieve Cloudinary image URL.");
            return;
          }

          onChange(imageUrl);
          setUploadError(null);
          setUploadSuccess(true);
          setTimeout(() => setUploadSuccess(false), 3000);
          onUploadSuccess?.(imageUrl);
        }}
        onError={(error: any) => {
          setUploadError(
            error?.message || "Cloudinary upload failed. Please try again."
          );
        }}
      >
        
        {({ open }) => (
         <div>
          <p>or</p>
           <Button type="button" className="bg-[#00ADB5] mt-3 hover:bg-[#00ADB5]/80" onClick={() => open()}>
            <Upload />
            Upload Image
          </Button>
         </div>
        )}
      </CldUploadWidget>

      {uploadSuccess && (
        <p className="text-sm text-emerald-600 flex items-center gap-1.5">
          <CheckCircle className="h-4 w-4" />
          Image uploaded successfully. The URL was added to your profile.
        </p>
      )}
      {(uploadError || externalError) && (
        <p className="text-sm text-destructive">
          {uploadError || externalError}
        </p>
      )}
    </div>
  );
}
