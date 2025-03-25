"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import NavMenu from "@/components/auth/nav-menu";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SubtleBackendCheck } from "@/components/subtle-backend-check";

export function ConditionalHeader() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 py-4 px-6 border-b bg-card/80 backdrop-blur-sm text-card-foreground transition-colors duration-200">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
        </Link>
        <div className="flex items-center space-x-4">
          <SubtleBackendCheck />
          <ThemeToggle />
          <NavMenu />
        </div>
      </div>
    </header>
  );
}
