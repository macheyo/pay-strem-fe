"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

export function SubtleBackendCheck() {
  const [status, setStatus] = useState<"loading" | "online" | "offline">(
    "loading"
  );
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    setStatus("loading");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/health`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setStatus("online");
      } else {
        setStatus("offline");
      }
    } catch {
      setStatus("offline");
    } finally {
      setIsChecking(false);
    }
  };

  // Check health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={checkHealth}
      disabled={isChecking}
      className="h-6 px-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
    >
      <div
        className={`w-2 h-2 rounded-full ${
          status === "online"
            ? "bg-green-500"
            : status === "offline"
            ? "bg-red-500"
            : "bg-yellow-500 animate-pulse"
        }`}
      />
      <span>
        {isChecking
          ? "Checking..."
          : status === "online"
          ? "API"
          : "API Offline"}
      </span>
    </Button>
  );
}
