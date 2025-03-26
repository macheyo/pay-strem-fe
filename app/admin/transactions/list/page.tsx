import { columns } from "./components/columns";
import UserTransactionListDataTable from "./components/user-transaction-list-data-table";
import { requireAuth } from "@/lib/server-auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/admin/layout";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Fetches transactions from the API using JWT claims for authentication
 */
async function fetchTransactions(jwtClaims: Record<string, unknown>) {
  const apiUrl = `${
    process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8080"
  }/api/v1/transactions`;

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
    return [];
  }

  return response.json();
}

interface ApiConfig {
  apiHost: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  userRoles: string[];
}

export default async function TransactionsPage() {
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
    // Fetch transactions using JWT claims
    const data = await fetchTransactions(user.rawClaims);

    // Create API config for the component
    const apiConfig: ApiConfig = {
      apiHost: process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8080",
      tenantId: tenantId,
      userName,
      userEmail,
      userRoles,
    };

    // Pass the transaction data to the component wrapped in AdminLayout
    return (
      <AdminLayout>
        <div className="space-y-6">
          <UserTransactionListDataTable
            data={data}
            columns={columns}
            apiConfig={apiConfig}
          />
        </div>
      </AdminLayout>
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);

    // Show an error message
    return (
      <AdminLayout>
        <Card className="border-red-200">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-red-500 mb-4">
              Error Loading Transactions
            </h2>
            <p className="mb-4">
              There was a problem fetching your transactions.
            </p>
            <button
              onClick={() => redirect("/admin/transactions/list")}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }
}
