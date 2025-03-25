"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  pathname: string;
}

export function Breadcrumbs({ pathname }: BreadcrumbsProps) {
  // Skip rendering breadcrumbs on the main admin page
  if (pathname === "/admin") {
    return null;
  }

  // Split the pathname into segments and create breadcrumb items
  const segments = pathname.split("/").filter(Boolean);

  // Create breadcrumb items with proper labels and links
  const breadcrumbItems = segments.map((segment, index) => {
    // Build the href for this breadcrumb
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    // Format the label (capitalize and replace hyphens with spaces)
    let label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Special case for admin to make it more readable
    if (segment === "admin" && index === 0) {
      label = "Admin";
    }

    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
      <ol className="flex items-center space-x-1">
        <li>
          <Link
            href="/admin"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight size={14} className="mx-1 text-muted-foreground" />
            <Link
              href={item.href}
              className={cn(
                "hover:text-foreground",
                index === breadcrumbItems.length - 1
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
              aria-current={
                index === breadcrumbItems.length - 1 ? "page" : undefined
              }
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
