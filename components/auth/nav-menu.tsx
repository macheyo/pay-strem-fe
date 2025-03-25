"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function NavMenu() {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status on mount and when pathname changes
    setIsAuthenticated(auth.isAuthenticated());
  }, [pathname]);

  const handleLogout = () => {
    auth.logout();
    setIsAuthenticated(false);
    // Force a reload to ensure all authenticated state is cleared
    window.location.href = "/";
  };

  return (
    <nav className="flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <Link
            href="/profile"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              pathname === "/profile" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Admin
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link
            href="/auth/login"
            className={`text-sm font-medium transition-colors hover:text-blue-600 ${
              pathname === "/auth/login" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Login
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Sign Up</Button>
          </Link>
        </>
      )}
    </nav>
  );
}
