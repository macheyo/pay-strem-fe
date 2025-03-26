"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Transaction } from "./columns";
import { useRouter } from "next/navigation";

interface DeleteTransactionActionProps {
  row: Row<Transaction>;

  apiConfig: ApiConfig;
  onDeleted: (transactionId: number) => void;
}

interface ApiConfig {
  apiHost: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  userRoles: string[];
}

export function DeleteTransactionAction({
  row,
  apiConfig,
  onDeleted,
}: DeleteTransactionActionProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const transaction = row.original;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // Make the delete request using cookies for authentication
      // The server middleware will extract auth headers from the cookie
      const response = await fetch(
        `${apiConfig.apiHost}/api/v1/transactions/${transaction.id}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            "X-Tenant-ID": "one-republic",
            "X-User-ID": apiConfig.userName,
            "X-User-Email": apiConfig.userName,
            "X-User-Roles": apiConfig.userRoles.join(","),
            "Content-Type": "application/json",
          },
        }
      );

      const responseBody = await response.text();
      console.log("Response:::", responseBody);

      if (!response.ok) {
        throw new Error(`Failed to delete transaction: ${responseBody}`);
      }

      // Close the dialog
      setOpen(false);

      // Show success message
      toast.success("Transaction deleted successfully");

      // Trigger the onDeleted callback to animate and remove the row
      onDeleted(transaction.id);

      // Refresh the data
      router.refresh();
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error("Failed to delete transaction");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete transaction #{transaction.id} for{" "}
              {transaction.accountName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 py-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
