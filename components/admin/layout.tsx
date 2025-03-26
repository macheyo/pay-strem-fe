"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";
import { cn } from "@/lib/utils"; // Import cn utility

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Add max-width and centering */}
        <main className="flex-1 overflow-auto p-6">
          <div className={cn("max-w-7xl mx-auto")}>
            <Breadcrumbs pathname={pathname} />
            <div className="mt-4">{children}</div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
