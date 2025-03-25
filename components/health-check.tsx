"use client";

import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";

interface HealthStatus {
  status: "loading" | "online" | "offline";
  message?: string;
}

export function HealthCheck() {
  const [healthStatus, setHealthStatus] = useState<HealthStatus>({
    status: "loading",
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkHealth = async () => {
    setIsChecking(true);
    setHealthStatus({ status: "loading" });

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
        const data = await response.json();
        setHealthStatus({
          status: "online",
          message: data.message || "Backend service is online",
        });
      } else {
        setHealthStatus({
          status: "offline",
          message: "Backend service is not responding correctly",
        });
      }
    } catch {
      setHealthStatus({
        status: "offline",
        message: "Could not connect to backend service",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Check health on component mount
  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg transition-colors duration-200 bg-card text-card-foreground">
      <div className="flex items-center space-x-2">
        <div
          className={`w-3 h-3 rounded-full ${
            healthStatus.status === "online"
              ? "bg-green-500"
              : healthStatus.status === "offline"
              ? "bg-red-500"
              : "bg-yellow-500 animate-pulse"
          }`}
        />
        <span className="font-medium">
          {healthStatus.status === "online"
            ? "Backend Online"
            : healthStatus.status === "offline"
            ? "Backend Offline"
            : "Checking Status..."}
        </span>
      </div>

      {healthStatus.message && (
        <p className="text-sm text-muted-foreground">{healthStatus.message}</p>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={checkHealth}
        disabled={isChecking}
        className="mt-2"
      >
        {isChecking ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Checking...
          </>
        ) : (
          "Check Again"
        )}
      </Button>
    </div>
  );
}
