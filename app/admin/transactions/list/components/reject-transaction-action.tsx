"use client";

import { useState } from "react";
import { Row } from "@tanstack/react-table";
import { XCircle } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";

interface RejectTransactionActionProps {
  row: Row<Transaction>;
  onRejected: (transactionId: number) => void;
}

export function RejectTransactionAction({
  row,
  onRejected,
}: RejectTransactionActionProps) {
  const [open, setOpen] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const router = useRouter();
  const transaction = row.original;

  const handleReject = async () => {
    try {
      setIsRejecting(true);

      // Construct the reject URL based on the transaction ID
      const rejectUrl = `/api/v1/transactions/${transaction.id}/reject`;

      // Make the reject request using cookies for authentication
      // The server middleware will extract auth headers from the cookie
      const response = await fetch(rejectUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason || "Rejected via batch action",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to reject transaction: ${response.statusText}`);
      }

      // Close the dialog
      setOpen(false);

      // Show success message
      toast.success("Transaction rejected successfully");

      // Trigger the onRejected callback to update the UI
      onRejected(transaction.id);

      // Refresh the data
      router.refresh();
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      toast.error("Failed to reject transaction");
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
      >
        <XCircle className="h-4 w-4" />
        <span className="sr-only">Reject</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject transaction #{transaction.id} for{" "}
              {transaction.accountName}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="rejectionReason"
              className="block text-sm font-medium mb-2"
            >
              Rejection Reason (Optional)
            </label>
            <Textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setRejectionReason(e.target.value)
              }
              placeholder="Enter reason for rejection"
              className="w-full"
            />
          </div>
          <DialogFooter className="flex space-x-2 py-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isRejecting}
            >
              {isRejecting ? "Rejecting..." : "Reject Transaction"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
