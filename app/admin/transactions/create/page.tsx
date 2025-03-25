import { Card, CardContent } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/layout";
import UserSingleTransactionForm from "./components/user-single-transaction-form";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/server-auth";

async function fetchBanks(jwtClaims: Record<string, unknown>) {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/banks`;

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

export default async function SinglePaymentPage() {
  // Get the authenticated session (redirects to login if not authenticated)
  const { user } = await requireAuth();

  try {
    // Fetch transactions using JWT claims
    const banks = await fetchBanks(user.rawClaims);

    // Pass the transaction data and user info to the component wrapped in AdminLayout
    return (
      <AdminLayout>
        <div className="space-y-6">
          <UserSingleTransactionForm
            banks={banks}
            userInfo={{
              tenantId: "one-republic",
              userId: user.email,
              userEmail: user.email,
              userRoles: Array.isArray(user.rawClaims.groups)
                ? user.rawClaims.groups
                : [],
            }}
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
