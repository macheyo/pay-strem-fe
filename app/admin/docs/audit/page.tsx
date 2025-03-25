"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Search,
} from "lucide-react";

// Sample audit log data
const auditLogs = Array.from({ length: 50 }, (_, i) => {
  const actions = [
    "User login",
    "Transaction created",
    "Transaction approved",
    "Transaction rejected",
    "Batch created",
    "Batch processed",
    "User created",
    "User role updated",
    "API key generated",
    "Settings updated",
  ];

  const users = [
    "admin@example.com",
    "user1@example.com",
    "user2@example.com",
    "approver@example.com",
    "system",
  ];

  const action = actions[Math.floor(Math.random() * actions.length)];
  const user = users[Math.floor(Math.random() * users.length)];
  const date = new Date(Date.now() - i * 3600000 * (Math.random() * 24 + 1));

  return {
    id: `LOG-${10000 + i}`,
    timestamp: date.toISOString(),
    action,
    user,
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
      Math.random() * 255
    )}`,
    details: action.includes("Transaction")
      ? { transactionId: `TRX-${1000 + Math.floor(Math.random() * 1000)}` }
      : action.includes("Batch")
      ? { batchId: `BATCH-${100 + Math.floor(Math.random() * 100)}` }
      : action.includes("User")
      ? { targetUser: users[Math.floor(Math.random() * users.length)] }
      : {},
  };
});

export default function AuditTrailPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Get unique actions for filter dropdown
  const uniqueActions = Array.from(new Set(auditLogs.map((log) => log.action)));

  // Filter logs based on search term and action filter
  const filteredLogs = auditLogs.filter(
    (log) =>
      (searchTerm === "" ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterAction === null || log.action === filterAction)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
            <p className="text-muted-foreground">
              Track all system activities and changes
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Export Logs</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle>System Activity Logs</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Search logs..."
                    className="rounded-md border border-input pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1); // Reset to first page on search
                    }}
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <select
                    className="rounded-md border border-input pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring appearance-none"
                    value={filterAction || ""}
                    onChange={(e) => {
                      setFilterAction(e.target.value || null);
                      setCurrentPage(1); // Reset to first page on filter change
                    }}
                  >
                    <option value="">All Actions</option>
                    {uniqueActions.map((action) => (
                      <option key={action} value={action}>
                        {action}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 font-medium">
                      <th className="py-3 px-4 text-left">Log ID</th>
                      <th className="py-3 px-4 text-left">Timestamp</th>
                      <th className="py-3 px-4 text-left">User</th>
                      <th className="py-3 px-4 text-left">Action</th>
                      <th className="py-3 px-4 text-left">IP Address</th>
                      <th className="py-3 px-4 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => (
                      <tr key={log.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono text-xs">
                          {log.id}
                        </td>
                        <td className="py-3 px-4">
                          {formatDate(log.timestamp)}
                        </td>
                        <td className="py-3 px-4">{log.user}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              log.action.includes("created") ||
                              log.action.includes("approved")
                                ? "bg-green-100 text-green-800"
                                : log.action.includes("login") ||
                                  log.action.includes("updated")
                                ? "bg-blue-100 text-blue-800"
                                : log.action.includes("rejected")
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {log.ipAddress}
                        </td>
                        <td className="py-3 px-4">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key} className="text-xs">
                              <span className="font-medium">{key}:</span>{" "}
                              {value}
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t px-4 py-3">
                <div className="text-sm text-muted-foreground">
                  Showing{" "}
                  <span className="font-medium">
                    {startIndex + 1}-
                    {Math.min(startIndex + itemsPerPage, filteredLogs.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredLogs.length}</span>{" "}
                  logs
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <div className="text-sm">
                    Page {currentPage} of {totalPages || 1}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
