"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/ui/data-table/data-table";
import { statuses } from "../data/data";
import {
  ColumnDef,
  Row,
  useReactTable,
  getCoreRowModel,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getFilteredRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { Transaction } from "./columns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { DeleteTransactionAction } from "./delete-transaction-action";
import { ApproveTransactionAction } from "./approve-transaction-action";
import { RejectTransactionAction } from "./reject-transaction-action";
import { BatchActions } from "./batch-actions";
import { toast } from "sonner";
import { capitalize } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface TransactionLinks {
  "submitted-transactions": string;
  "failed-transactions": string;
  "pending_approval-transactions": string;
  "rejected-transactions": string;
  "approved-transactions": string;
  "transaction-details": Record<string, { self: string }>;
  self: string;
  update: string;
  collection: string;
  transactions: string;
  "completed-transactions": string;
  delete: string;
}

interface TransactionResponse {
  _links: TransactionLinks;
  count: number;
  transactions: Transaction[];
}

interface ApiConfig {
  apiHost: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  userRoles: string[];
}
interface Props {
  data: TransactionResponse;
  columns: ColumnDef<Transaction>[];
  apiConfig: ApiConfig;
}

// Create a custom ActionsCell component that uses the HATEOAS links
const ActionsCell = ({
  row,
  links,
  apiConfig,
  onDelete,
}: {
  row: Row<Transaction>;
  links: TransactionLinks;
  apiConfig: ApiConfig;
  onDelete: (id: number) => void;
}) => {
  const transaction = row.original;
  const transactionId = transaction.id.toString();

  // Get the delete URL from the HATEOAS links
  const deleteUrl =
    links.delete ||
    (links["transaction-details"] &&
      links["transaction-details"][transactionId] &&
      links["transaction-details"][transactionId].self);

  // Only show approve/reject actions for transactions in PENDING_APPROVAL or SUBMITTED status
  const canApproveReject = ["PENDING_APPROVAL", "SUBMITTED"].includes(
    transaction.status
  );

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0" asChild>
        <a href={`/admin/transactions/${transactionId}/view`}>
          <span className="sr-only">View</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </a>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 p-0" asChild>
        <a href={`/admin/transactions/${transactionId}/edit`}>
          <span className="sr-only">Edit</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </a>
      </Button>
      {canApproveReject && (
        <ApproveTransactionAction
          row={row}
          onApproved={() => onDelete(transaction.id)}
        />
      )}
      {canApproveReject && (
        <RejectTransactionAction
          row={row}
          onRejected={() => onDelete(transaction.id)}
        />
      )}
      {deleteUrl && (
        <DeleteTransactionAction
          row={row}
          deleteUrl={deleteUrl}
          apiConfig={apiConfig}
          onDeleted={() => onDelete(transaction.id)}
        />
      )}
    </div>
  );
};

export default function UserTransactionListDataTable({
  data,
  columns: initialColumns,
  apiConfig,
}: Readonly<Props>) {
  const router = useRouter();
  // Create state for transactions to handle animations
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [count, setCount] = useState(0);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  // Initialize state from props
  useEffect(() => {
    setTransactions(data.transactions || []);
    setCount(data.count || 0);
  }, [data]);

  // Handle transaction actions (delete, approve, reject)
  const handleTransactionDeleted = (transactionId: number) => {
    // Add to deleting IDs to trigger animation
    setDeletingIds((prev) => [...prev, transactionId]);

    // Show toast notification
    toast.success("Transaction deleted successfully");

    // Find the row element and add animation classes
    const rowElement = document.querySelector(`tr[data-id="${transactionId}"]`);
    if (rowElement) {
      rowElement.classList.add(
        "bg-red-50",
        "opacity-50",
        "transition-all",
        "duration-500",
        "h-0",
        "overflow-hidden"
      );
    }

    // Remove from state after animation completes
    setTimeout(() => {
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
      setDeletingIds((prev) => prev.filter((id) => id !== transactionId));
      setCount((prev) => prev - 1);
    }, 500); // Match animation duration
  };

  // Handle batch actions
  const handleBatchAction = (ids: number[], action: "approve" | "reject") => {
    // Add all IDs to deleting IDs to trigger animation
    setDeletingIds((prev) => [...prev, ...ids]);

    // Find the row elements and add animation classes
    ids.forEach((id) => {
      const rowElement = document.querySelector(`tr[data-id="${id}"]`);
      if (rowElement) {
        rowElement.classList.add(
          action === "approve" ? "bg-green-50" : "bg-red-50",
          "opacity-50",
          "transition-all",
          "duration-500"
        );
      }
    });

    // Update the transactions after animation completes
    setTimeout(() => {
      setTransactions((prev) =>
        prev.map((t) => {
          if (ids.includes(t.id)) {
            return {
              ...t,
              status: action === "approve" ? "APPROVED" : "REJECTED",
            };
          }
          return t;
        })
      );
      setDeletingIds((prev) => prev.filter((id) => !ids.includes(id)));
    }, 500); // Match animation duration
  };

  // Modify columns to use our custom ActionsCell
  const columns = [...initialColumns];

  // Replace the actions column with our custom one
  const actionsColumnIndex = columns.findIndex((col) => col.id === "actions");
  if (actionsColumnIndex >= 0) {
    columns[actionsColumnIndex] = {
      id: "actions",
      cell: ({ row }) => (
        <ActionsCell
          row={row}
          apiConfig={apiConfig}
          links={data._links}
          onDelete={handleTransactionDeleted}
        />
      ),
    };
  }

  // State for row selection
  const [rowSelection, setRowSelection] = useState({});

  // State for column filters and sorting
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  // Create the table instance with full filtering capabilities
  const table = useReactTable({
    data: transactions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      rowSelection,
      columnFilters,
      sorting,
      columnVisibility,
    },
  });

  // Add a meta field to each row for the deletion animation
  const tableData = transactions.map((transaction) => {
    const isDeleting = deletingIds.includes(transaction.id);
    return {
      ...transaction,
      meta: {
        className: isDeleting
          ? "bg-red-50 opacity-50 transition-all duration-500"
          : "",
        "data-id": transaction.id,
      },
    };
  });

  // Handle export
  const handleExport = () => {
    try {
      // Determine which transactions to export (selected rows or all)
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const hasSelected = selectedRows.length > 0;
      const transactionsToExport = hasSelected
        ? selectedRows.map((row) => row.original)
        : transactions;

      // Create CSV content
      const headers = [
        "ID",
        "Account Name",
        "Account Number",
        "Bank",
        "Amount",
        "Currency",
        "Status",
        "Payment Method",
        "Created By",
        "Created At",
      ];

      const csvRows = [
        headers.join(","),
        ...transactionsToExport.map((t) => {
          return [
            t.id,
            `"${t.accountName?.replace(/"/g, '""') || ""}"`,
            `"${t.accountNumber?.replace(/"/g, '""') || ""}"`,
            `"${t.bank?.name?.replace(/"/g, '""') || ""}"`,
            t.money?.amount || 0,
            t.money?.currency || "",
            t.status || "",
            t.paymentMethod || "",
            `"${t.createdBy?.replace(/"/g, '""') || ""}"`,
            new Date(t.createdAt).toISOString(),
          ].join(",");
        }),
      ];

      const csvContent = csvRows.join("\n");

      // Create a blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `transactions-export-${hasSelected ? "selected-" : ""}${
          new Date().toISOString().split("T")[0]
        }.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        `${transactionsToExport.length} transactions exported successfully`
      );
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("Failed to export transactions");
    }
  };

  return (
    <Card>
      {/* Adjust header layout: remove justify-between, add gap */}
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="flex-grow">
          {" "}
          {/* Allow title section to take available space */}
          <CardTitle>Transactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Showing {transactions.length} of {count} total transactions
          </p>
        </div>
        <div className="flex space-x-2">
          <BatchActions table={table} onBatchAction={handleBatchAction} />
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1"
            onClick={() => {
              router.push("/admin/transactions/create");
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 gap-1 ${
              table.getFilteredSelectedRowModel().rows.length > 0
                ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
                : ""
            }`}
            onClick={handleExport}
          >
            <Download className="h-3.5 w-3.5" />
            <span>
              Export
              {table.getFilteredSelectedRowModel().rows.length > 0
                ? ` (${table.getFilteredSelectedRowModel().rows.length})`
                : ""}
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          table={table}
          data={tableData}
          columns={columns}
          filterPlaceholder="Search transactions..."
          filterColumnId="accountName"
          filterableColumns={[
            { columnId: "status", title: "Status", options: statuses },
            {
              columnId: "bankName",
              title: "Bank",
              options: Array.from(
                new Set(transactions.map((t) => t.bank?.name).filter(Boolean))
              ).map((name) => ({
                label: name as string,
                value: name as string,
              })),
            },
            {
              columnId: "paymentMethod",
              title: "Payment Type",
              options: (() => {
                // Get unique payment methods
                const uniqueMethods = Array.from(
                  new Set(
                    transactions
                      .map((t) => t.paymentMethod)
                      .filter(Boolean) as string[]
                  )
                );

                // Map them to label/value pairs
                return uniqueMethods.map((method) => ({
                  label: method
                    .split("_")
                    .map((word) => capitalize(word.toLowerCase()))
                    .join(" "),
                  value: method,
                  // Add color classes for the filter pills
                  className: (() => {
                    switch (method.toUpperCase()) {
                      case "BANK_TRANSFER":
                        return "bg-blue-100 text-blue-800 border-blue-200";
                      case "MOBILE_MONEY":
                        return "bg-green-100 text-green-800 border-green-200";
                      case "CARD":
                        return "bg-purple-100 text-purple-800 border-purple-200";
                      case "CASH":
                        return "bg-amber-100 text-amber-800 border-amber-200";
                      case "CHEQUE":
                        return "bg-indigo-100 text-indigo-800 border-indigo-200";
                      case "ZIPIT":
                        return "bg-teal-100 text-teal-800 border-teal-200";
                      case "RTGS":
                        return "bg-cyan-100 text-cyan-800 border-cyan-200";
                      default:
                        return "bg-gray-100 text-gray-800 border-gray-200";
                    }
                  })(),
                }));
              })(),
            },
          ]}
        />
      </CardContent>
    </Card>
  );
}
