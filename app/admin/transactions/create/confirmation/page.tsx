"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Download, Home, Calendar, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PaymentConfirmationPage() {
  const [transactionId, setTransactionId] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Generate a random transaction ID
    const randomId =
      "TX-" +
      Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, "0");
    setTransactionId(randomId);

    // Set current date
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto w-full max-w-md overflow-hidden border-none bg-card shadow-lg">
          <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 px-6 py-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Payment Successful!
            </CardTitle>
            <CardDescription className="mt-2 text-base">
              Your payment has been processed successfully
            </CardDescription>
          </div>
          <CardContent className="space-y-6 p-6">
            <div className="rounded-lg border bg-muted/30 p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Transaction ID
                </span>
                <span className="font-mono font-medium">{transactionId}</span>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Date & Time
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{currentDate}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-gradient-to-b from-muted/30 to-background p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status
                </h3>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
                  <span className="font-medium text-emerald-600">Complete</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Processing Time
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Immediate</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Confirmation
                  </span>
                  <span>Email Sent</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-lg border bg-muted/10 p-5 text-center">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent with the payment details.
              </p>
              <p className="text-sm text-muted-foreground">
                The recipient will be notified of this payment.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t bg-muted/10 p-6">
            <Button variant="outline" className="w-full gap-2 border-dashed">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Link href="/dashboard" className="w-full">
              <Button
                variant="default"
                className="w-full gap-2 bg-primary shadow-md transition-all hover:shadow-lg"
              >
                <Home className="h-4 w-4" />
                Return to Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
