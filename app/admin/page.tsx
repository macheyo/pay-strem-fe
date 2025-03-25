"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminLayout } from "@/components/admin/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const router = useRouter();

  // Redirect to the dashboard page immediately
  useEffect(() => {
    router.replace("/admin/transactions/dashboard");
  }, [router]);

  return (
    <AdminLayout>
      <div className="flex items-center justify-center h-full">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Redirecting...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Taking you to the dashboard...</p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
