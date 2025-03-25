"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/layout";
import {
  ArrowUpDown,
  Check,
  CreditCard,
  DollarSign,
  Download,
  Plus,
  RefreshCw,
  X,
} from "lucide-react";
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for the charts
const chartData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 900 },
  { name: "Mar", total: 1600 },
  { name: "Apr", total: 1800 },
  { name: "May", total: 2200 },
  { name: "Jun", total: 2600 },
  { name: "Jul", total: 2400 },
];

// Sample transaction data

export default function Dashboard() {
  // Activity data with IDs
  const [activities, setActivities] = useState([
    {
      id: "act-1",
      message: "Payment to Acme Corp successful",
      amount: "1,200.00",
      time: "2 hours ago",
      status: "completed",
      isNew: false,
    },
    {
      id: "act-2",
      message: "zipit transfer processing",
      amount: "499.99",
      time: "3 hours ago",
      status: "processing",
      isNew: false,
    },
    {
      id: "act-3",
      message: "Payment to Office Supplies failed",
      amount: "150.00",
      time: "1 day ago",
      status: "failed",
      isNew: false,
    },
    {
      id: "act-4",
      message: "Payment to Marketing Partners successful",
      amount: "899.95",
      time: "2 days ago",
      status: "completed",
      isNew: false,
    },
  ]);

  // Function to add a random new activity
  const addRandomActivity = () => {
    const recipients = [
      "Global Tech",
      "ABC Corp",
      "XYZ Industries",
      "Local Services",
      "Cloud Solutions",
    ];
    const statuses = ["completed", "processing", "failed"];
    const amounts = ["750.00", "1,299.99", "450.50", "2,100.00", "85.75"];

    const randomRecipient =
      recipients[Math.floor(Math.random() * recipients.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];

    let message = "";
    if (randomStatus === "completed") {
      message = `Payment to ${randomRecipient} successful`;
    } else if (randomStatus === "processing") {
      message = `zipit transfer to ${randomRecipient} processing`;
    } else {
      message = `Payment to ${randomRecipient} failed`;
    }

    const newActivity = {
      id: `act-${Date.now()}`,
      message,
      amount: randomAmount,
      time: "Just now",
      status: randomStatus,
      isNew: true,
    };

    // Add the new activity at the top
    setActivities((prev) => [newActivity, ...prev.slice(0, 3)]);

    // Remove the "new" status after animation completes
    setTimeout(() => {
      setActivities((prev) =>
        prev.map((activity) =>
          activity.id === newActivity.id
            ? { ...activity, isNew: false }
            : activity
        )
      );
    }, 3000);
  };

  const router = useRouter();

  return (
    <AdminLayout>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/20 to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Processed
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpDown className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="font-medium text-emerald-500">+20.1%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none bg-gradient-to-br from-emerald-500/20 to-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Transactions
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,350</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpDown className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="font-medium text-emerald-500">+15%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none bg-gradient-to-br from-red-500/20 to-red-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Failed Transactions
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
              <X className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpDown className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="font-medium text-emerald-500">-5%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500/20 to-blue-500/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processing Fee
            </CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
              <CreditCard className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,345.63</div>
            <div className="mt-1 flex items-center text-xs text-muted-foreground">
              <ArrowUpDown className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="font-medium text-emerald-500">+12.3%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Transaction Analytics</CardTitle>
              <CardDescription>
                Payment volume and success rate over time
              </CardDescription>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Select defaultValue="monthly">
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Tabs defaultValue="volume" className="mb-4">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                  <TabsTrigger value="success">Success Rate</TabsTrigger>
                </TabsList>
                <TabsContent value="volume" className="mt-2">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorTotal"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3b82f6"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3b82f6"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          borderColor: "#e2e8f0",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [`$${value}`, "Volume"]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                      />
                      <Bar
                        dataKey="total"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="success" className="mt-2">
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart
                      data={[
                        { name: "Jan", rate: 96 },
                        { name: "Feb", rate: 94 },
                        { name: "Mar", rate: 98 },
                        { name: "Apr", rate: 97 },
                        { name: "May", rate: 99 },
                        { name: "Jun", rate: 98 },
                        { name: "Jul", rate: 97 },
                      ]}
                    >
                      <defs>
                        <linearGradient
                          id="colorRate"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.2}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="name"
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#888888"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                        domain={[90, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                        formatter={(value) => [`${value}%`, "Success Rate"]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 2,
                          r: 4,
                          fill: "hsl(var(--background))",
                        }}
                        activeDot={{
                          r: 6,
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 2,
                          fill: "hsl(var(--background))",
                        }}
                        animationDuration={1500}
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        fill="url(#colorRate)"
                        fillOpacity={0.2}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-background to-muted/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transaction events</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                onClick={addRandomActivity}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Simulate
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 overflow-hidden">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={cn(
                  "flex items-center gap-4 transition-all duration-500",
                  activity.isNew && "animate-[slide-in_0.5s_ease-out_forwards]"
                )}
                style={
                  activity.isNew
                    ? { opacity: 0, transform: "translateX(-100%)" }
                    : {}
                }
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full",
                    activity.status === "completed"
                      ? "bg-emerald-500/10 ring-1 ring-emerald-500/20"
                      : activity.status === "processing"
                      ? "bg-amber-500/10 ring-1 ring-amber-500/20"
                      : "bg-red-500/10 ring-1 ring-red-500/20"
                  )}
                >
                  {activity.status === "completed" && (
                    <Check className="h-5 w-5 text-emerald-500" />
                  )}
                  {activity.status === "processing" && (
                    <RefreshCw className="h-5 w-5 text-amber-500" />
                  )}
                  {activity.status === "failed" && (
                    <X className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        activity.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-600"
                          : activity.status === "processing"
                          ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-600"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600",
                        activity.isNew &&
                          "animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                      )}
                    >
                      ${activity.amount}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-background to-muted/10">
        <CardHeader>
          <div className="grid gap-2">
            <CardTitle>Create New Payment</CardTitle>
            <CardDescription>
              Process single or bulk payments to your recipients
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 to-primary/5 transition-colors hover:from-primary/20 hover:to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <CreditCard className="mr-2 h-5 w-5 text-primary" />
                Single Payment
              </CardTitle>
              <CardDescription>
                Process a payment to a single recipient
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground">
                Quick and easy way to send funds to an individual recipient with
                detailed tracking.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full gap-2"
                onClick={() => {
                  router.push("/admin/transactions/create");
                }}
              >
                <Plus className="h-4 w-4" />
                New Payment
              </Button>
            </CardFooter>
          </Card>

          {/* <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-500/10 to-blue-500/5 transition-colors hover:from-blue-500/20 hover:to-blue-500/10">
            <CardHeader>
              <CardTitle className="flex items-center text-base">
                <RefreshCw className="mr-2 h-5 w-5 text-blue-500" />
                Bulk Payments
              </CardTitle>
              <CardDescription>
                Process multiple payments at once
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <p className="text-sm text-muted-foreground">
                Efficiently send payments to multiple recipients in a single
                batch transaction.
              </p>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => {
                  router.push("/dashboard/batches/create");
                }}
              >
                <Plus className="h-4 w-4" />
                New Bulk Payment
              </Button>
            </CardFooter>
          </Card> */}
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex w-full items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Need to view all transactions?{" "}
              <a
                href="/admin/transactions/list"
                className="text-primary hover:underline"
              >
                Go to Transactions
              </a>
            </p>
            <Button variant="ghost" size="sm" className="gap-1">
              <Download className="h-3.5 w-3.5" />
              Export Reports
            </Button>
          </div>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
}
