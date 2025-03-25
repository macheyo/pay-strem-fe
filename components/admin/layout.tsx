"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { Breadcrumbs } from "@/components/admin/breadcrumbs";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6">
          <Breadcrumbs pathname={pathname} />
          <div className="mt-4">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
