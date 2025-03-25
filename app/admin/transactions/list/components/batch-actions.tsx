"use client";

import { useState } from "react";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
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

interface BatchActionsProps {
  table: Table<Transaction>;
  onBatchAction: (ids: number[], action: "approve" | "reject") => void;
}

export function BatchActions({ table, onBatchAction }: BatchActionsProps) {
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const router = useRouter();

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row) => row.original.id);
  const hasSelected = selectedIds.length > 0;

  const handleBatchApprove = async () => {
    try {
      setIsProcessing(true);

      // Construct the batch approve URL
      const batchApproveUrl = `/api/transactions/batch/approve`;

      // Make the batch approve request using cookies for authentication
      // The server middleware will extract auth headers from the cookie
      const response = await fetch(batchApproveUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionIds: selectedIds,
          approvalNotes: "Approved via batch action",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to approve transactions: ${response.statusText}`
        );
      }

      // Close the dialog
      setApproveDialogOpen(false);

      // Show success message
      toast.success(`${selectedIds.length} transactions approved successfully`);

      // Trigger the onBatchAction callback to update the UI
      onBatchAction(selectedIds, "approve");

      // Clear selection
      table.resetRowSelection();

      // Refresh the data
      router.refresh();
    } catch (error) {
      console.error("Error approving transactions:", error);
      toast.error("Failed to approve transactions");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBatchReject = async () => {
    try {
      setIsProcessing(true);

      // Construct the batch reject URL
      const batchRejectUrl = `/api/transactions/batch/reject`;

      // Make the batch reject request using cookies for authentication
      // The server middleware will extract auth headers from the cookie
      const response = await fetch(batchRejectUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionIds: selectedIds,
          rejectionReason: rejectionReason || "Rejected via batch action",
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to reject transactions: ${response.statusText}`
        );
      }

      // Close the dialog
      setRejectDialogOpen(false);

      // Show success message
      toast.success(`${selectedIds.length} transactions rejected successfully`);

      // Trigger the onBatchAction callback to update the UI
      onBatchAction(selectedIds, "reject");

      // Clear selection
      table.resetRowSelection();

      // Refresh the data
      router.refresh();
    } catch (error) {
      console.error("Error rejecting transactions:", error);
      toast.error("Failed to reject transactions");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className={`h-8 gap-1 ${
          hasSelected ? "bg-green-50 text-green-600 hover:bg-green-100" : ""
        }`}
        onClick={() => setApproveDialogOpen(true)}
        disabled={!hasSelected}
      >
        <CheckCircle className="h-3.5 w-3.5" />
        <span>Approve {hasSelected ? `(${selectedIds.length})` : ""}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className={`h-8 gap-1 ${
          hasSelected ? "bg-red-50 text-red-600 hover:bg-red-100" : ""
        }`}
        onClick={() => setRejectDialogOpen(true)}
        disabled={!hasSelected}
      >
        <XCircle className="h-3.5 w-3.5" />
        <span>Reject {hasSelected ? `(${selectedIds.length})` : ""}</span>
      </Button>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Approve Transactions</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve {selectedIds.length} selected
              transactions?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 py-3">
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={handleBatchApprove}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Approve ${selectedIds.length} Transactions`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Transactions</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject {selectedIds.length} selected
              transactions?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label
              htmlFor="batchRejectionReason"
              className="block text-sm font-medium mb-2"
            >
              Rejection Reason (Optional)
            </label>
            <Textarea
              id="batchRejectionReason"
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
              onClick={() => setRejectDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleBatchReject}
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing..."
                : `Reject ${selectedIds.length} Transactions`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
