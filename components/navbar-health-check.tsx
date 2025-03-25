"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";

export function NavbarHealthCheck() {
  const [status, setStatus] = useState<
    "idle" | "loading" | "online" | "offline"
  >("idle");
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

  return (
    <div className="flex items-center space-x-2">
      {status !== "idle" && (
        <div
          className={`w-2 h-2 rounded-full ${
            status === "online"
              ? "bg-green-500"
              : status === "offline"
              ? "bg-red-500"
              : "bg-yellow-500 animate-pulse"
          }`}
        />
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={checkHealth}
        disabled={isChecking}
        className="text-sm flex items-center space-x-1"
      >
        {isChecking ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-3 w-3 text-current"
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
            <span>Checking...</span>
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              {status === "idle"
                ? "Check Backend"
                : status === "online"
                ? "Backend Online"
                : "Backend Offline"}
            </span>
          </>
        )}
      </Button>
    </div>
  );
}
