"use client";

import { useState, useCallback, useRef } from "react";
import { UI_TIMEOUTS } from "@/lib/constants";

interface UseCopyToClipboardReturn {
  hasCopiedRecently: boolean;
  copyText: (text: string) => Promise<boolean>;
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [hasCopiedRecently, setHasCopiedRecently] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const copyText = useCallback(async (text: string): Promise<boolean> => {
    // Clear any existing timeout to prevent memory leaks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      // Check if clipboard API is available (requires secure context)
      if (!navigator.clipboard) {
        console.warn("Clipboard API not available");
        return false;
      }

      await navigator.clipboard.writeText(text);
      setHasCopiedRecently(true);

      timeoutRef.current = setTimeout(() => {
        setHasCopiedRecently(false);
        timeoutRef.current = null;
      }, UI_TIMEOUTS.CLIPBOARD_RESET);

      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false;
    }
  }, []);

  return { hasCopiedRecently, copyText };
}
