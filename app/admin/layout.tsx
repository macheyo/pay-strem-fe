"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { SubtleBackendCheck } from "@/components/subtle-backend-check";
import { useRouter } from "next/navigation";
import { auth, getSession } from "@/lib/auth";

// Profile info component to display user name and role
function ProfileInfo() {
  const [userInfo, setUserInfo] = useState<{ name?: string; roles?: string[] }>(
    {
      name: undefined,
      roles: undefined,
    }
  );

  useEffect(() => {
    async function loadUserInfo() {
      const session = await getSession();
      if (session?.user) {
        setUserInfo({
          name: session.user.name,
          roles: session.user.roles,
        });
      }
    }

    loadUserInfo();
  }, []);

  return (
    <div>
      <div className="font-semibold">{userInfo.name || "User"}</div>
      <div className="text-xs text-muted-foreground mt-1">
        {userInfo.roles && userInfo.roles.length > 0
          ? userInfo.roles.map((role) => role.replace(/_/g, " ")).join(", ")
          : "No role assigned"}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false);
  const [isDocumentationOpen, setIsDocumentationOpen] = useState(false);

  const transactionsRef = useRef<HTMLDivElement>(null);
  const documentationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close transactions dropdown if clicked outside
      if (
        isTransactionsOpen &&
        transactionsRef.current &&
        !transactionsRef.current.contains(event.target as Node)
      ) {
        setIsTransactionsOpen(false);
      }

      // Close documentation dropdown if clicked outside
      if (
        isDocumentationOpen &&
        documentationRef.current &&
        !documentationRef.current.contains(event.target as Node)
      ) {
        setIsDocumentationOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTransactionsOpen, isDocumentationOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 py-4 px-6 border-b bg-card/80 backdrop-blur-sm text-card-foreground transition-colors duration-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <Logo />
            </Link>

            {/* Navigation Menu */}
            <nav className="flex items-center space-x-6">
              <Link
                href="/admin/transactions/dashboard"
                className="font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/transactions/list"
                className="font-medium hover:text-primary transition-colors"
              >
                Transactions
              </Link>

              {/* <div className="relative" ref={transactionsRef}>
                <button
                  onClick={() => setIsTransactionsOpen(!isTransactionsOpen)}
                  className="flex items-center space-x-1 font-medium hover:text-primary transition-colors"
                >
                  <span>Transactions</span>
                  <ChevronDown size={16} />
                </button>
                {isTransactionsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-md shadow-lg border p-2 z-50">
                    <Link
                      href="/admin/transactions/list"
                      className="block px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      List
                    </Link>
                    <Link
                      href="/admin/transactions/batches"
                      className="block px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      Bulk
                    </Link>
                  </div>
                )}
              </div> */}

              <div className="relative" ref={documentationRef}>
                <button
                  onClick={() => setIsDocumentationOpen(!isDocumentationOpen)}
                  className="flex items-center space-x-1 font-medium hover:text-primary transition-colors"
                >
                  <span>Documentation</span>
                  <ChevronDown size={16} />
                </button>
                {isDocumentationOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-card rounded-md shadow-lg border p-2 z-50">
                    <Link
                      href="/admin/docs/api"
                      className="block px-4 py-2 hover:bg-accent rounded-md transition-colors"
                    >
                      API Documentation
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <SubtleBackendCheck />
            <ThemeToggle />

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 bg-primary text-primary-foreground"
                >
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm font-medium border-b mb-1">
                  <ProfileInfo />
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    auth.logout();
                    router.push("/auth/login");
                  }}
                  className="cursor-pointer"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {children}
    </>
  );
}
