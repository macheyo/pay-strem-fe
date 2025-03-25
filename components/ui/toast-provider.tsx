"use client";

import { Toaster } from "sonner";
import { useTheme } from "@/components/theme-provider";

export function ToastProvider() {
  const { isDarkMode } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      theme={isDarkMode ? "dark" : "light"}
      toastOptions={{
        // Customize the toast styles
        style: {
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          zIndex: 9999, // Ensure toasts appear above everything else
        },
      }}
      // Additional container styling to ensure toasts are above other elements
      className="toast-container z-[9999]"
    />
  );
}
