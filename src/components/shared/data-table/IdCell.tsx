"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

interface IdCellProps {
  id: string;
  maxWidth?: string;
}

export const IdCell = ({ id, maxWidth = "120px" }: IdCellProps) => {
  const { hasCopiedRecently, copyText } = useCopyToClipboard();

  const handleCopy = () => {
    copyText(id);
  };

  return (
    <div className="flex items-center gap-2 group">
      <code
        className="text-xs font-mono text-slate-500 truncate hover:text-[#00ADB5]"
        style={{ maxWidth }}
      >
        {id}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-40 group-hover:opacity-100 transition-opacity cursor-pointer"
        onClick={handleCopy}
      >
        {hasCopiedRecently ? (
          <Check className="h-3 w-3 text-green-500" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};
