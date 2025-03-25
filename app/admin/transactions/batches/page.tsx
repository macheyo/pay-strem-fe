"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus, Search } from "lucide-react";

// Sample batch data
const batches = Array.from({ length: 10 }, (_, i) => ({
  id: `BATCH-${100 + i}`,
  date: new Date(Date.now() - i * 86400000 * 3).toISOString().split("T")[0],
  totalAmount: `$${(Math.random() * 100000).toFixed(2)}`,
  status: ["Processed", "Pending", "Failed"][Math.floor(Math.random() * 3)],
  transactionCount: Math.floor(Math.random() * 100) + 10,
  description: `Batch ${i + 1} transactions`,
  transactions: Array.from(
    { length: Math.floor(Math.random() * 5) + 3 },
    (_, j) => ({
      id: `TRX-${1000 + i * 10 + j}`,
      amount: `$${(Math.random() * 1000).toFixed(2)}`,
      recipient: `Recipient ${j + 1}`,
      status: ["Completed", "Pending", "Failed"][Math.floor(Math.random() * 3)],
    })
  ),
}));

export default function BatchesPage() {
  const [expandedBatches, setExpandedBatches] = useState<
    Record<string, boolean>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  // Filter batches based on search term
  const filteredBatches = batches.filter(
    (batch) =>
      batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleBatchExpansion = (batchId: string) => {
    setExpandedBatches({
      ...expandedBatches,
      [batchId]: !expandedBatches[batchId],
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Batches</h1>
            <p className="text-muted-foreground">Manage transaction batches</p>
          </div>
          <Button size="sm" className="h-8 gap-1">
            <Plus className="h-3.5 w-3.5" />
            <span>New Batch</span>
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Batch List</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search batches..."
                  className="rounded-md border border-input pl-8 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50 font-medium">
                      <th className="py-3 px-4 text-left">Batch ID</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Description</th>
                      <th className="py-3 px-4 text-left">Transactions</th>
                      <th className="py-3 px-4 text-left">Total Amount</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.map((batch) => (
                      <>
                        <tr
                          key={batch.id}
                          className="border-b hover:bg-muted/50"
                        >
                          <td className="py-3 px-4">{batch.id}</td>
                          <td className="py-3 px-4">{batch.date}</td>
                          <td className="py-3 px-4">{batch.description}</td>
                          <td className="py-3 px-4">
                            {batch.transactionCount}
                          </td>
                          <td className="py-3 px-4">{batch.totalAmount}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                batch.status === "Processed"
                                  ? "bg-green-100 text-green-800"
                                  : batch.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {batch.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleBatchExpansion(batch.id)}
                              className="h-8 w-8 p-0"
                            >
                              {expandedBatches[batch.id] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </td>
                        </tr>
                        {expandedBatches[batch.id] && (
                          <tr>
                            <td colSpan={7} className="p-0">
                              <div className="bg-muted/30 p-4">
                                <h4 className="font-medium mb-2">
                                  Transactions in this batch
                                </h4>
                                <div className="rounded-md border bg-background">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="border-b bg-muted/50 font-medium">
                                        <th className="py-2 px-4 text-left">
                                          Transaction ID
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                          Recipient
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                          Amount
                                        </th>
                                        <th className="py-2 px-4 text-left">
                                          Status
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {batch.transactions.map((transaction) => (
                                        <tr
                                          key={transaction.id}
                                          className="border-b last:border-0 hover:bg-muted/50"
                                        >
                                          <td className="py-2 px-4">
                                            {transaction.id}
                                          </td>
                                          <td className="py-2 px-4">
                                            {transaction.recipient}
                                          </td>
                                          <td className="py-2 px-4">
                                            {transaction.amount}
                                          </td>
                                          <td className="py-2 px-4">
                                            <span
                                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                transaction.status ===
                                                "Completed"
                                                  ? "bg-green-100 text-green-800"
                                                  : transaction.status ===
                                                    "Pending"
                                                  ? "bg-yellow-100 text-yellow-800"
                                                  : "bg-red-100 text-red-800"
                                              }`}
                                            >
                                              {transaction.status}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
