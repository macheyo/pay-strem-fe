"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/auth";
import ProtectedRoute from "@/components/auth/protected-route";

export default function ProfilePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and redirect to dashboard
    if (auth.isAuthenticated()) {
      router.push("/admin/transactions/dashboard");
    }
  }, [router]);

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-12 px-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    </ProtectedRoute>
  );
}
