"use client";

import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserCreateNewTransactionButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setLoading(true);
    await router.push("/dashboard/transactions/create");
    setLoading(false);
  };

  return (
    <Button onClick={handleClick} disabled={loading}>
      <div className="flex flex-row items-center gap-2">
        {loading && <LoadingDots color="#A8A29E" />}
        <div>Create New Transaction</div>
      </div>
    </Button>
  );
}
