"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import clsx from "clsx";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-8 h-8" />; // Avoid hydration mismatch
    }

    return (
        <div className="flex items-center gap-1 bg-muted/20 p-1 rounded-full border border-white/5">
            <button
                onClick={() => setTheme("system")}
                className={clsx(
                    "p-1.5 rounded-full transition-colors",
                    theme === "system" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
                title="System Theme"
            >
                <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => setTheme("light")}
                className={clsx(
                    "p-1.5 rounded-full transition-colors",
                    theme === "light" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
                title="Light Mode"
            >
                <Sun className="w-3.5 h-3.5" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={clsx(
                    "p-1.5 rounded-full transition-colors",
                    theme === "dark" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
                title="Dark Mode"
            >
                <Moon className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
