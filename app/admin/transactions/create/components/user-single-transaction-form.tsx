"use client";

import type React from "react";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building,
  Check,
  CreditCard,
  DollarSign,
  Info,
  Lock,
  User,
  FileText,
  Calendar,
  AlertCircle,
  BanknoteIcon as Bank,
  Landmark,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface UserInfo {
  tenantId: string;
  userId: string;
  userEmail: string;
  userRoles: string[];
}

interface Props {
  banks: BanksResponse;
  userInfo: UserInfo;
}

interface Bank {
  id: number;
  name: string;
  branchCode: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  active: boolean;
}

interface BankLinks {
  self: string;
  update: string;
  toggleStatus: string;
  delete: string;
}

interface BankData {
  bank: Bank;
  _links: BankLinks;
}

interface BanksResponseLinks {
  activeBanks: string;
  self: string;
  create: string;
}

interface BanksResponse {
  banks: BankData[];
  _links: BanksResponseLinks;
  count: number;
}

export default function UserSingleTransactionForm({
  banks,
  userInfo,
}: Readonly<Props>) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    recipientName: "",
    recipientAccount: "",
    recipientBank: "",
    reference: "",
    paymentMethod: "rtgs",
    paymentDate: "now",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Memoize the banks list to avoid unnecessary re-renders
  const memoizedBanks = useMemo(() => banks, [banks]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!paymentDetails.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(paymentDetails.amount.replace(/,/g, "")))) {
      newErrors.amount = "Please enter a valid amount";
    }

    if (!paymentDetails.recipientName) {
      newErrors.recipientName = "Recipient name is required";
    }

    if (!paymentDetails.recipientAccount) {
      newErrors.recipientAccount = "Account number is required";
    } else if (!/^\d+$/.test(paymentDetails.recipientAccount)) {
      newErrors.recipientAccount = "Account number must contain only digits";
    }

    if (!paymentDetails.recipientBank) {
      newErrors.recipientBank = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };
  // User info is now passed as a prop from the server

  const handleSubmit = async () => {
    try {
      // Create the request payload
      const payload = {
        accountName: paymentDetails.recipientName,
        accountNumber: paymentDetails.recipientAccount,
        bankBranchCode: paymentDetails.recipientBank,
        currency: "USD",
        amount: paymentDetails.amount.replace(/,/g, ""),
        exchangeRate: 0,
      };

      // Make the API request using the server-provided user info
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Tenant-ID": "one-republic",
            "X-User-ID": userInfo.userId,
            "X-User-Email": userInfo.userEmail,
            "X-User-Roles": userInfo.userRoles.join(","),
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        toast.success("Transaction created successfully");
        router.push("/admin/transactions/list");
      } else {
        toast.error(`Failed to create transaction: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast.error(`There was a problem with processing your request: ${error}`);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove non-digit characters except decimal point
    const digits = value.replace(/[^\d.]/g, "");

    // Format with commas
    const parts = digits.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const formattedValue = formatCurrency(value);
    setPaymentDetails((prev) => ({ ...prev, amount: formattedValue }));

    // Clear error when field is edited
    if (errors.amount) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header */}
      {/* <header className="border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <DollarSign className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold">Pay Stream</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-primary/30 bg-primary/5 text-primary"
            >
              <Lock className="h-3 w-3" />
              <span>Secure Transaction</span>
            </Badge>
          </div>
        </div>
      </header> */}
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto w-full max-w-3xl">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="relative flex justify-between">
              <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-muted"></div>
              <div className="relative flex flex-col items-center">
                <div
                  className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step === 1
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-primary bg-primary text-primary-foreground"
                  }`}
                >
                  {step > 1 ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step === 1 ? "text-primary" : ""
                  }`}
                >
                  Payment Details
                </span>
              </div>

              <div className="relative flex flex-col items-center">
                <div
                  className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step === 2
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted bg-background text-muted-foreground"
                  }`}
                >
                  2
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${
                    step === 2 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Review & Confirm
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Payment Details */}
          {step === 1 && (
            <Card className="overflow-hidden border-none bg-card shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <DollarSign className="h-5 w-5 text-primary" />
                      Payment Details
                    </CardTitle>
                    <CardDescription>
                      Enter the details for this payment
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 border-primary/30 bg-primary/5 text-primary"
                  >
                    <Lock className="h-3 w-3" />
                    <span>Secure Transaction</span>
                  </Badge>
                </div>
              </CardHeader>
              {/* Reduce vertical spacing */}
              <CardContent className="relative -mt-4 space-y-6 rounded-t-3xl bg-card px-6 pt-6">
                {/* Amount */}
                <div className="space-y-3">
                  <Label
                    htmlFor="amount"
                    className="flex items-center gap-1 text-base"
                  >
                    Payment Amount
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Enter the amount you want to send</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center rounded-l-md border-r bg-muted/50 px-3">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="amount"
                      name="amount"
                      placeholder="0.00"
                      className={`pl-12 text-lg ${
                        errors.amount ? "border-red-500" : ""
                      }`}
                      value={paymentDetails.amount}
                      onChange={handleAmountChange}
                    />
                  </div>
                  {errors.amount && (
                    <p className="flex items-center gap-1 text-sm text-red-500">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Recipient Information */}
                <div className="space-y-5 rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-medium">Recipient Information</h3>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="recipientName">Recipient Name</Label>
                    <Input
                      id="recipientName"
                      name="recipientName"
                      placeholder="John Doe or Company Name"
                      className={errors.recipientName ? "border-red-500" : ""}
                      value={paymentDetails.recipientName}
                      onChange={handleChange}
                    />
                    {errors.recipientName && (
                      <p className="flex items-center gap-1 text-sm text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.recipientName}
                      </p>
                    )}
                  </div>

                  {/* Adjust grid gap */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="recipientAccount">Account Number</Label>
                      <Input
                        id="recipientAccount"
                        name="recipientAccount"
                        placeholder="Account Number"
                        className={
                          errors.recipientAccount ? "border-red-500" : ""
                        }
                        value={paymentDetails.recipientAccount}
                        onChange={handleChange}
                      />
                      {errors.recipientAccount && (
                        <p className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.recipientAccount}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="recipientBank">Bank Name</Label>
                      <Select
                        value={paymentDetails.recipientBank}
                        onValueChange={(value: string) =>
                          handleSelectChange("recipientBank", value)
                        }
                      >
                        <SelectTrigger
                          id="recipientBank"
                          className={
                            errors.recipientBank ? "border-red-500" : ""
                          }
                        >
                          <SelectValue placeholder="Select Bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="flex items-center justify-between border-b px-2 py-1.5">
                            <span className="text-sm font-medium">
                              Select Bank
                            </span>
                          </div>
                          {memoizedBanks?.banks?.length ?? 0 > 0 ? (
                            memoizedBanks?.banks?.map((bankRecord) => (
                              <SelectItem
                                key={bankRecord.bank.branchCode}
                                value={bankRecord.bank.branchCode}
                                className="flex items-center gap-2"
                              >
                                <Bank className="h-4 w-4 text-blue-600" />
                                {bankRecord.bank.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem
                              value="other"
                              className="flex items-center gap-2"
                            >
                              <Landmark className="h-4 w-4" />
                              Other Bank
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      {errors.recipientBank && (
                        <p className="flex items-center gap-1 text-sm text-red-500">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {errors.recipientBank}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-5 rounded-xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-2 border-b pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-medium">Payment Details</h3>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="reference">Payment Reference</Label>
                    <Input
                      id="reference"
                      name="reference"
                      placeholder="Invoice #12345 or Payment Description"
                      value={paymentDetails.reference}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Payment Method</Label>
                    <RadioGroup
                      defaultValue="rtgs"
                      value={paymentDetails.paymentMethod}
                      onValueChange={(value: string) =>
                        handleSelectChange("paymentMethod", value)
                      }
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="rtgs" id="rtgs" />
                        <Label
                          htmlFor="rtgs"
                          className="flex flex-1 items-center gap-2 font-normal"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10">
                            <Building className="h-4 w-4 text-emerald-500" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">RTGS Transfer</span>
                            <p className="text-xs text-muted-foreground">
                              1-3 business days
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-auto bg-emerald-500/10 text-emerald-500"
                          >
                            Free
                          </Badge>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="zipit" id="zipit" />
                        <Label
                          htmlFor="zipit"
                          className="flex flex-1 items-center gap-2 font-normal"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                            <CreditCard className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="flex-1">
                            <span className="font-medium">ZIPIT Transfer</span>
                            <p className="text-xs text-muted-foreground">
                              Same day processing
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-auto bg-blue-500/10 text-blue-500"
                          >
                            $0.25 Fee
                          </Badge>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">Payment Date</Label>
                    <RadioGroup
                      defaultValue="now"
                      value={paymentDetails.paymentDate}
                      onValueChange={(value: string) =>
                        handleSelectChange("paymentDate", value)
                      }
                      className="flex flex-col space-y-2"
                    >
                      <div className="flex items-center space-x-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="now" id="now" />
                        <Label
                          htmlFor="now"
                          className="flex flex-1 items-center gap-2 font-normal"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium">
                              Process Immediately
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Start processing right away
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label
                          htmlFor="scheduled"
                          className="flex flex-1 items-center gap-2 font-normal"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <span className="font-medium">
                              Schedule for Later
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Choose a future date
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end bg-card px-6 py-5">
                <Button
                  onClick={handleContinue}
                  className="gap-2 px-8 py-6 text-base shadow-md transition-all hover:shadow-lg"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Review & Confirm */}
          {step === 2 && (
            <Card className="overflow-hidden border-none bg-card shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-8">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Check className="h-5 w-5 text-primary" />
                  Review & Confirm
                </CardTitle>
                <CardDescription>
                  Please review your payment details before confirming
                </CardDescription>
              </CardHeader>
              <CardContent className="relative -mt-4 space-y-8 rounded-t-3xl bg-card px-6 pt-6">
                <div className="overflow-hidden rounded-xl border bg-gradient-to-b from-muted/30 to-background shadow-sm">
                  <div className="bg-muted/30 p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Payment Amount
                      </h3>
                      <p className="text-3xl font-bold text-primary">
                        ${paymentDetails.amount}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4 p-6">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Recipient
                      </span>
                      <span className="font-medium">
                        {paymentDetails.recipientName}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Account Number
                      </span>
                      <span className="font-medium">
                        {paymentDetails.recipientAccount
                          .replace(/(\d{4})/g, "$1 ")
                          .trim()}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bank
                      </span>
                      <div className="flex items-center gap-2">
                        {paymentDetails.recipientBank === "chase" && (
                          <>
                            <Bank className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">Chase Bank</span>
                          </>
                        )}
                        {paymentDetails.recipientBank === "bofa" && (
                          <>
                            <Bank className="h-4 w-4 text-red-600" />
                            <span className="font-medium">Bank of America</span>
                          </>
                        )}
                        {paymentDetails.recipientBank === "wells" && (
                          <>
                            <Bank className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">Wells Fargo</span>
                          </>
                        )}
                        {paymentDetails.recipientBank === "citi" && (
                          <>
                            <Bank className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">Citibank</span>
                          </>
                        )}
                        {paymentDetails.recipientBank === "other" && (
                          <>
                            <Landmark className="h-4 w-4" />
                            <span className="font-medium">Other Bank</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Payment Method
                      </span>
                      <div className="flex items-center gap-2">
                        {paymentDetails.paymentMethod === "rtgs" ? (
                          <>
                            <Building className="h-4 w-4 text-emerald-500" />
                            <span className="font-medium">rtgs Transfer</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 text-blue-500" />
                            <span className="font-medium">zipit Transfer</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Payment Date
                      </span>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {paymentDetails.paymentDate === "now"
                            ? "Immediate Processing"
                            : "Scheduled"}
                        </span>
                      </div>
                    </div>

                    {paymentDetails.reference && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">
                          Reference
                        </span>
                        <span className="font-medium">
                          {paymentDetails.reference}
                        </span>
                      </div>
                    )}

                    {paymentDetails.paymentMethod === "zipit" && (
                      <div className="flex justify-between text-muted-foreground">
                        <span className="text-sm">zipit Transfer Fee</span>
                        <span>$0.25</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="bg-muted/10 p-6">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-bold text-primary">
                        $
                        {paymentDetails.amount
                          ? (
                              Number(paymentDetails.amount.replace(/,/g, "")) +
                              (paymentDetails.paymentMethod === "zipit"
                                ? 0.25
                                : 0)
                            ).toFixed(2)
                          : "0.00"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/50 dark:bg-amber-900/20">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800 dark:text-amber-500">
                        Important Information
                      </h4>
                      <p className="mt-1 text-sm text-amber-800/80 dark:text-amber-500/80">
                        {paymentDetails.paymentMethod === "rtgs"
                          ? "rtgs transfers typically take 1-3 business days to process. Funds will be debited from your account once the payment is initiated."
                          : "zipit transfers are typically processed within 24 hours on business days. A $0.25 fee will be applied to your transaction."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border bg-muted/10 p-5 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Secure Transaction</h4>
                    <p className="text-sm text-muted-foreground">
                      This transaction is secured with bank-level encryption and
                      security protocols.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-card px-6 py-5">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="gap-2 px-6"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="gap-2 bg-primary px-8 py-6 text-base shadow-md transition-all hover:shadow-lg"
                >
                  Confirm Payment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
