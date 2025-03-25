"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Define proper types for the transaction data
interface Bank {
  id: number;
  name: string;
  branchCode: string;
}

interface Money {
  currency: string;
  amount: number;
}

interface Transaction {
  id: number;
  amount: string;
  status: string;
  createdAt: string;
  recipientName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
  reference: string;
  paymentMethod: string;
  description: string;
  createdBy: string;
  bank: Bank;
  money: Money | number;
}

// API configuration for saving transactions
interface ApiConfig {
  transactionId: string;
  apiHost: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  userRoles: string[];
}

interface Props {
  initialTransaction: Transaction;
  apiConfig: ApiConfig;
}

// Simple notification component
const Notification = ({
  message,
  type = "success",
  onClose,
}: {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}) => {
  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-md p-4 shadow-md ${
        type === "success"
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? (
          <Check className="h-5 w-5" />
        ) : (
          <AlertCircle className="h-5 w-5" />
        )}
        <p>{message}</p>
        <button
          onClick={onClose}
          className="ml-4 rounded-full p-1 hover:bg-black/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default function UserEditTransaction({
  initialTransaction,
  apiConfig,
}: Readonly<Props>) {
  const router = useRouter();
  const [transactionData, setTransactionData] =
    useState<Transaction>(initialTransaction);
  const [originalTransaction, setOriginalTransaction] =
    useState<Transaction>(initialTransaction);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  } | null>(null);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTransactionData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Show notification
  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setNotification({
      message,
      type,
      visible: true,
    });

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!transactionData.recipientName) {
      newErrors.recipientName = "Recipient name is required";
    }

    if (!transactionData.accountNumber) {
      newErrors.accountNumber = "Account number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = async () => {
    if (validateForm()) {
      try {
        // Prepare the data for API
        const apiData = {
          accountName: transactionData.recipientName,
          accountNumber: transactionData.accountNumber,
          bankId: originalTransaction.bank?.id,
          amount: parseFloat(transactionData.amount.replace(/,/g, "")),
          currency:
            typeof originalTransaction.money === "object"
              ? originalTransaction.money.currency
              : "USD",
          paymentMethod: transactionData.paymentMethod,
          paymentReference: transactionData.reference,
          bankBranchCode: originalTransaction.bank.branchCode,
        };

        // Send update to API
        const response = await fetch(
          `${apiConfig.apiHost}/api/v1/transactions/${apiConfig.transactionId}`,
          {
            method: "PUT",
            headers: {
              accept: "application/json",
              "X-Tenant-ID": "one-republic",
              "X-User-ID": apiConfig.userName,
              "X-User-Email": apiConfig.userEmail,
              "X-User-Roles": apiConfig.userRoles.join(","),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(apiData),
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to update transaction: ${response.statusText}`
          );
        }

        // Update local state
        setOriginalTransaction(transactionData);

        // Show success notification
        showNotification("Transaction updated successfully");

        // Redirect to transactions list
        router.push("/admin/transactions/list");
      } catch (err) {
        console.error("Failed to save transaction:", err);
        showNotification(`Failed to update transaction: ${err}`, "error");
      }
    }
  };

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium">
            Loading transaction details...
          </h2>
        </div>
      </div>
    );
  }

  // Show error state if fetch failed
  if (error || !transactionData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-red-500">Error</h2>
          <p>{error || "Failed to load transaction data"}</p>
          <Button
            className="mt-4"
            onClick={() => router.push("/admin/transactions/list")}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Notification */}
      {notification && notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Transaction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recipient Name */}
          <div className="space-y-3">
            <Label htmlFor="recipientName">
              Recipient Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="recipientName"
              name="recipientName"
              placeholder="John Doe or Company Name"
              className={errors.recipientName ? "border-red-500" : ""}
              value={transactionData.recipientName}
              onChange={handleChange}
            />
            {errors.recipientName && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.recipientName}
              </p>
            )}
          </div>

          {/* Account Number */}
          <div className="space-y-3">
            <Label htmlFor="accountNumber">
              Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Account Number"
              className={errors.accountNumber ? "border-red-500" : ""}
              value={transactionData.accountNumber}
              onChange={handleChange}
            />
            {errors.accountNumber && (
              <p className="flex items-center gap-1 text-sm text-red-500">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors.accountNumber}
              </p>
            )}
          </div>

          {/* Reference */}
          <div className="space-y-3">
            <Label htmlFor="reference">Payment Reference</Label>
            <Input
              id="reference"
              name="reference"
              placeholder="Invoice #12345 or Payment Description"
              value={transactionData.reference || ""}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Additional details about this payment"
              value={transactionData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <Button className="w-full gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
