"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = () => {
      const authenticated = auth.isAuthenticated();
      setIsAuthenticated(authenticated);

      if (!authenticated) {
        // Redirect to login page with a return URL
        const returnUrl = encodeURIComponent(pathname || "/");
        router.push(`/auth/login?returnUrl=${returnUrl}`);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }

  // If authenticated, render the children
  return isAuthenticated ? <>{children}</> : null;
}
