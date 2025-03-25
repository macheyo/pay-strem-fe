"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { auth, authApi } from "@/lib/auth";
import {
  ChevronRight,
  LayoutDashboard,
  List,
  Package,
  FileText,
  Activity,
  Building,
  User,
  LogOut,
} from "lucide-react";

interface SideMenuProps {
  isCollapsed: boolean;
}

export function SideMenu({ isCollapsed }: SideMenuProps) {
  const pathname = usePathname();
  const [selectedTenant, setSelectedTenant] = useState("Tenant 1");
  const [tenantDropdownOpen, setTenantDropdownOpen] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = auth.getToken();
        if (!token) return;

        const userData = await authApi.getCurrentUser(token);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user profile", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    auth.logout();
    window.location.href = "/";
  };

  const toggleTenantDropdown = () => {
    if (!isCollapsed) {
      setTenantDropdownOpen(!tenantDropdownOpen);
    }
  };

  const menuItems = [
    {
      title: "Transactions",
      icon: <LayoutDashboard size={20} />,
      submenu: [
        {
          title: "Dashboard",
          href: "/admin/transactions/dashboard",
          icon: <LayoutDashboard size={16} />,
        },
        {
          title: "List",
          href: "/admin/transactions/list",
          icon: <List size={16} />,
        },
        {
          title: "Batches",
          href: "/admin/transactions/batches",
          icon: <Package size={16} />,
        },
      ],
    },
    {
      title: "Documentation",
      icon: <FileText size={20} />,
      submenu: [
        {
          title: "API Documentation",
          href: "/admin/docs/api",
          icon: <FileText size={16} />,
        },
      ],
    },
    {
      title: "Audit Trail",
      icon: <Activity size={20} />,
      submenu: [
        {
          title: "System Logs",
          href: "/admin/docs/audit",
          icon: <Activity size={16} />,
        },
      ],
    },
  ];

  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    Transactions: true,
    Documentation: false,
    "Audit Trail": false,
  });

  const toggleSubmenu = (title: string) => {
    if (!isCollapsed) {
      setExpandedMenus({
        ...expandedMenus,
        [title]: !expandedMenus[title],
      });
    }
  };

  return (
    <aside
      className={cn(
        "h-full flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <div className="flex h-16 items-center justify-center border-b px-4">
            <div className="flex items-center">
              {!isCollapsed && (
                <span className="text-xl font-semibold">PayStream</span>
              )}
              {isCollapsed && <span className="text-xl font-semibold">PS</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1 p-2">
            {/* Tenant Selector */}
            <div className="relative mb-4">
              <button
                onClick={toggleTenantDropdown}
                className={cn(
                  "flex w-full items-center rounded-md border p-2 transition-all",
                  isCollapsed ? "justify-center" : "justify-between"
                )}
              >
                <div className="flex items-center gap-2">
                  <Building size={20} />
                  {!isCollapsed && <span>{selectedTenant}</span>}
                </div>
                {!isCollapsed && (
                  <ChevronRight
                    className={cn(
                      "transition-transform",
                      tenantDropdownOpen ? "rotate-90" : ""
                    )}
                    size={16}
                  />
                )}
              </button>

              {tenantDropdownOpen && !isCollapsed && (
                <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border bg-background p-1 shadow-md">
                  {["Tenant 1", "Tenant 2", "Tenant 3"].map((tenant) => (
                    <button
                      key={tenant}
                      className={cn(
                        "flex w-full items-center rounded-md p-2 hover:bg-accent",
                        selectedTenant === tenant ? "bg-accent/50" : ""
                      )}
                      onClick={() => {
                        setSelectedTenant(tenant);
                        setTenantDropdownOpen(false);
                      }}
                    >
                      {tenant}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Menu Items */}
            {menuItems.map((item) => (
              <div key={item.title} className="mb-1">
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={cn(
                    "flex w-full items-center rounded-md p-2 hover:bg-accent",
                    isCollapsed ? "justify-center" : "justify-between"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && item.submenu.length > 1 && (
                    <ChevronRight
                      className={cn(
                        "transition-transform",
                        expandedMenus[item.title] ? "rotate-90" : ""
                      )}
                      size={16}
                    />
                  )}
                </button>

                {(expandedMenus[item.title] ||
                  isCollapsed ||
                  item.submenu.length === 1) && (
                  <div
                    className={cn(
                      "mt-1 space-y-1",
                      isCollapsed ? "relative" : "pl-6"
                    )}
                  >
                    {item.submenu.map((subItem) => {
                      const isActive = pathname === subItem.href;

                      return isCollapsed ? (
                        <div key={subItem.title} className="group relative">
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex justify-center rounded-md p-2 hover:bg-accent",
                              isActive ? "bg-accent" : ""
                            )}
                          >
                            {subItem.icon}
                          </Link>
                          <div className="absolute left-full top-0 z-50 ml-2 hidden rounded-md border bg-background px-2 py-1 shadow-md group-hover:block">
                            {subItem.title}
                          </div>
                        </div>
                      ) : (
                        <Link
                          key={subItem.title}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-2 rounded-md p-2 hover:bg-accent",
                            isActive ? "bg-accent" : ""
                          )}
                        >
                          {subItem.icon}
                          <span>{subItem.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mt-auto border-t p-4">
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User size={16} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
