"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { CheckCircle } from "lucide-react";
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

interface ApproveTransactionActionProps {
  row: Row<Transaction>;
  onApproved: (transactionId: number) => void;
}

export function ApproveTransactionAction({
  row,
  onApproved,
}: ApproveTransactionActionProps) {
  const [open, setOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const router = useRouter();
  const transaction = row.original;

  const handleApprove = async () => {
    try {
      setIsApproving(true);

      // Construct the approve URL based on the transaction ID
      const approveUrl = `/api/transactions/${transaction.id}/approve`;

      // Make the approve request using cookies for authentication
      // The server middleware will extract auth headers from the cookie
      const response = await fetch(approveUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvalNotes: "Approved via batch action",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to approve transaction: ${response.statusText}`
        );
      }

      // Close the dialog
      setOpen(false);

      // Show success message
      toast.success("Transaction approved successfully");

      // Trigger the onApproved callback to update the UI
      onApproved(transaction.id);

      // Refresh the data
      router.refresh();
    } catch (error) {
      console.error("Error approving transaction:", error);
      toast.error("Failed to approve transaction");
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
      >
        <CheckCircle className="h-4 w-4" />
        <span className="sr-only">Approve</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve transaction #{transaction.id} for{" "}
              {transaction.accountName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 py-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isApproving}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={isApproving}
            >
              {isApproving ? "Approving..." : "Approve Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
