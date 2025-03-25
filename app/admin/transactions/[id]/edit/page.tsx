import { redirect } from "next/navigation";
import UserEditTransaction from "./components/user-edit-transaction";
import { requireAuth } from "@/lib/server-auth";
import { Card, CardContent } from "@/components/ui/card";

// Define the Transaction interface to match what UserEditTransaction expects
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
  bank: {
    id: number;
    name: string;
    branchCode: string;
  };
  money:
    | {
        currency: string;
        amount: number;
      }
    | number;
}

// Define the ApiConfig interface
interface ApiConfig {
  transactionId: string;
  apiHost: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  userRoles: string[];
}

// Define our props type using a type alias instead of an interface
type Props = {
  params: { id: string };
  searchParams?: Record<string, string | string[]>;
};

async function fetchTransaction(
  jwtClaims: Record<string, unknown>,
  id: string
) {
  const apiUrl = `${
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8080"
  }/api/v1/transactions/${id}`;

  // Extract headers from JWT claims
  const headers = {
    accept: "application/json",
    "X-Tenant-ID": "one-republic",
    "X-User-ID": (jwtClaims.name as string) || (jwtClaims.sub as string) || "",
    "X-User-Email": (jwtClaims.email as string) || "",
    "X-User-Roles": Array.isArray(jwtClaims.groups)
      ? jwtClaims.groups.join(",")
      : "",
  };

  const response = await fetch(apiUrl, {
    headers,
    cache: "no-store", // Disable caching
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transaction data");
  }

  const data = await response.json();

  // Format the data into our expected format
  return {
    id: data.transaction.id,
    amount: data.transaction.amount.toLocaleString(),
    status: data.transaction.status,
    createdAt: data.transaction.createdAt,
    recipientName: data.transaction.accountName,
    accountNumber: data.transaction.accountNumber,
    routingNumber: data.transaction.bank?.branchCode || "",
    bankName: data.transaction.bank?.name || "",
    reference: data.transaction.paymentReference || "",
    paymentMethod: data.transaction.paymentMethod || "rtgs",
    description: "",
    createdBy: data.transaction.createdBy,
    bank: data.transaction.bank,
    money: data.transaction.amount,
  };
}

export default async function TransactionPage({ params }: Props) {
  // Get the authenticated session (redirects to login if not authenticated)
  const { user } = await requireAuth();

  try {
    // Get user information
    const userName =
      (user.rawClaims.name as string) || (user.rawClaims.sub as string) || "";
    const userEmail = (user.rawClaims.email as string) || "";
    const userRolesString = Array.isArray(user.rawClaims.groups)
      ? user.rawClaims.groups.join(",")
      : "";
    // Convert userRoles to an array as expected by the component
    const userRoles = userRolesString ? userRolesString.split(",") : [];
    const tenantId = "one-republic";

    // Fetch transaction data server-side
    const transactionData = (await fetchTransaction(
      user.rawClaims,
      params.id
    )) as unknown as Transaction;

    // Create API config for the component
    const apiConfig: ApiConfig = {
      transactionId: params.id,
      apiHost: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8080",
      tenantId: tenantId,
      userName,
      userEmail,
      userRoles,
    };

    // Pass the transaction data to the component
    return (
      <div className="space-y-6">
        <UserEditTransaction
          initialTransaction={transactionData}
          apiConfig={apiConfig}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading transaction page:", error);

    // Show an error message
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6 text-center">
          <h2 className="text-xl font-semibold text-red-500 mb-4">
            Error Loading Transaction
          </h2>
          <p className="mb-4">
            There was a problem loading the transaction details.
          </p>
          <button
            onClick={() => redirect("/admin/transactions/list")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go Back
          </button>
        </CardContent>
      </Card>
    );
  }
}
