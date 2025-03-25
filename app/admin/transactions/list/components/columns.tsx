"use client";

import { ColumnDef } from "@tanstack/react-table";
import { statuses } from "../data/data";

import { Checkbox } from "@/components/ui/checkbox";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { capitalize } from "@/lib/utils";
import { ActionsCell } from "@/components/ui/data-table/data-table-action-cell";

// const badgeStyle = (color: string) => ({
//   borderColor: `${color}20`,
//   backgroundColor: `${color}30`,
//   color,
// });

interface Bank {
  id: number;
  name: string;
  branchCode: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  active: boolean;
}

interface Money {
  currency: string;
  amount: number;
  exchangeRate: number;
}

export interface Transaction {
  id: number;
  tenantId: string;
  accountName: string;
  accountNumber: string;
  bank: Bank;
  money: Money;
  status: string;
  batchId: string | null;
  createdBy: string;
  approvedBy: string | null;
  rejectedBy: string | null;
  approvalNotes: string | null;
  rejectionReason: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  paymentMethod: string | null;
  paymentReference: string | null;
}

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "accountName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">
        {capitalize(row.getValue("accountName"))}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "accountNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">
        {capitalize(row.getValue("accountNumber"))}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row: Transaction) => row.bank?.name ?? "N/A",
    id: "bankName", // Unique ID since we're using accessorFn
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bank" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">
        {capitalize(String(row.getValue("bankName")))}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created By" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px] truncate">
        {capitalize(row.getValue("createdBy"))}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row: Transaction) =>
      `${row.money?.currency?.toUpperCase() || ""} ${
        row.money?.amount?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) || "0.00"
      }`,
    id: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue("amount") as string;
      const parts = amount.split(" ");
      const currency = parts[0];
      const value = parts[1];

      return (
        <div className="font-medium">
          <span className="text-xs text-muted-foreground mr-1">{currency}</span>
          <span>{value}</span>
        </div>
      );
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      // Define color schemes for different statuses
      const getStatusColor = (value: string) => {
        switch (value) {
          case "APPROVED":
            return "bg-green-100 text-green-800 border-green-200";
          case "REJECTED":
            return "bg-red-100 text-red-800 border-red-200";
          case "PENDING_APPROVAL":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "SUBMITTED":
            return "bg-blue-100 text-blue-800 border-blue-200";
          case "COMPLETED":
            return "bg-emerald-100 text-emerald-800 border-emerald-200";
          case "FAILED":
            return "bg-rose-100 text-rose-800 border-rose-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      return (
        <div className="flex items-center">
          <div
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              status.value
            )}`}
          >
            {status.icon && (
              <status.icon className="mr-1 h-3.5 w-3.5 inline-block" />
            )}
            {status.label}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Type" />
    ),
    cell: ({ row }) => {
      const paymentMethod = row.getValue("paymentMethod") as string | null;

      if (!paymentMethod) {
        return (
          <span className="text-muted-foreground text-xs">Not specified</span>
        );
      }

      // Define color schemes for different payment methods
      const getPaymentMethodColor = (method: string) => {
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
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };

      const formattedMethod = paymentMethod
        .split("_")
        .map((word) => capitalize(word.toLowerCase()))
        .join(" ");

      return (
        <div className="flex items-center">
          <div
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentMethodColor(
              paymentMethod
            )}`}
          >
            {formattedMethod}
          </div>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id) as string);
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formattedDate = date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {formattedDate}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      let onEditUrl, onViewUrl, onDeleteUrl;
      const id = row.original.id;
      if (id) {
        onEditUrl = `/dashboard/transactions/${id}/edit`;
        onViewUrl = `/dashboard/transactions/${id}/edit`;
        onDeleteUrl = `/dashboard/transactions/${id}/delete`;
      }
      return <ActionsCell {...{ row, onEditUrl, onViewUrl, onDeleteUrl }} />;
    },
  },
];
