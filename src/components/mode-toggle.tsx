"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-6" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <label
            htmlFor="ThemeToggle"
            className="inline-flex items-center space-x-4 cursor-pointer dark:text-gray-800"
        >
            <span> <Sun className="dark:text-[#f3f4f6] transition-colors" /></span>
            <span className="relative">
                <input
                    id="ThemeToggle"
                    type="checkbox"
                    className="hidden peer"
                    checked={isDark}
                    onChange={() => setTheme(isDark ? "light" : "dark")}
                />
                <div className="w-10 h-6 rounded-full shadow-inner border  dark:bg-gray-600 peer-checked:dark:bg-cyan-500" />
                <div className="absolute inset-y-0 left-0 w-4 h-4 m-1 border rounded-full shadow peer-checked:right-0 peer-checked:left-auto dark:bg-gray-100" />
            </span>
            <span><Moon className="dark:text-[#f3f4f6] transition-colors" /></span>
        </label>
    );
}
