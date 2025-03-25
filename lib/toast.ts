import { toast } from "sonner";

// Toast types
export type ToastType = "success" | "error" | "info" | "warning";

// Toast options
interface ToastOptions {
  duration?: number;
  id?: string;
  description?: string;
}

/**
 * Show a toast notification
 * @param message The message to display
 * @param type The type of toast (success, error, info, warning)
 * @param options Additional options for the toast
 */
export function showToast(
  message: string,
  type: ToastType = "info",
  options?: ToastOptions
) {
  const { duration = 4000, id, description } = options || {};

  // Custom styling based on toast type
  const style = {
    backgroundColor: getBackgroundColor(type),
    color: getTextColor(type),
    border: `1px solid ${getBorderColor(type)}`,
    zIndex: 9999, // Ensure toasts appear above everything else
  };

  // Get appropriate title based on type
  const title = getToastTitle(type, message);

  switch (type) {
    case "success":
      toast.success(title, { duration, id, description, style });
      break;
    case "error":
      toast.error(title, { duration, id, description, style });
      break;
    case "warning":
      toast.warning(title, { duration, id, description, style });
      break;
    case "info":
    default:
      toast.info(title, { duration, id, description, style });
      break;
  }
}

/**
 * Show a toast notification for validation errors
 * @param violations Array of validation errors
 */
export function showValidationErrorToast(
  violations: Array<{ field: string; message: string }>
) {
  if (!violations || violations.length === 0) {
    showToast("Validation error occurred", "error");
    return;
  }

  // Sort violations by field name for more logical ordering
  const sortedViolations = [...violations].sort((a, b) => {
    // Sort by field name
    const fieldA = a.field.toLowerCase();
    const fieldB = b.field.toLowerCase();

    // Put required fields first
    const aIsRequired = a.message.toLowerCase().includes("required");
    const bIsRequired = b.message.toLowerCase().includes("required");

    if (aIsRequired && !bIsRequired) return -1;
    if (!aIsRequired && bIsRequired) return 1;

    return fieldA.localeCompare(fieldB);
  });

  // Create a description with all validation errors
  const description = sortedViolations.map((v) => `• ${v.message}`).join("\n");

  showToast("Validation Failed", "error", {
    description,
    duration: 6000, // Show longer for multiple errors
  });
}

/**
 * Get an appropriate title for the toast based on type and message
 */
function getToastTitle(type: ToastType, message: string): string {
  // Default titles based on type
  const defaultTitles: Record<ToastType, string> = {
    success: "Success",
    error: "Error",
    warning: "Warning",
    info: "Information",
  };

  // If message is short (less than 30 chars), use it as the title
  if (message.length < 30) {
    return message;
  }

  // Otherwise use default title
  return defaultTitles[type];
}

// Helper functions for toast styling
function getBackgroundColor(type: ToastType): string {
  switch (type) {
    case "success":
      return "rgba(34, 197, 94, 0.1)"; // Light green
    case "error":
      return "rgba(239, 68, 68, 0.1)"; // Light red
    case "warning":
      return "rgba(245, 158, 11, 0.1)"; // Light amber
    case "info":
    default:
      return "rgba(59, 130, 246, 0.1)"; // Light blue
  }
}

function getTextColor(type: ToastType): string {
  switch (type) {
    case "success":
      return "rgb(22, 163, 74)"; // Green
    case "error":
      return "rgb(220, 38, 38)"; // Red
    case "warning":
      return "rgb(217, 119, 6)"; // Amber
    case "info":
    default:
      return "rgb(37, 99, 235)"; // Blue
  }
}

function getBorderColor(type: ToastType): string {
  switch (type) {
    case "success":
      return "rgba(34, 197, 94, 0.2)"; // Green border
    case "error":
      return "rgba(239, 68, 68, 0.2)"; // Red border
    case "warning":
      return "rgba(245, 158, 11, 0.2)"; // Amber border
    case "info":
    default:
      return "rgba(59, 130, 246, 0.2)"; // Blue border
  }
}
