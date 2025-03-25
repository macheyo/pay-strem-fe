"use client";

import React from "react";

export function AnimatedGraphics() {
  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-indigo-950 dark:to-blue-900">
      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full animate-pulse" />
      <div
        className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-500/20 dark:bg-blue-400/20 rounded-full animate-ping"
        style={{ animationDuration: "3s" }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-purple-500/20 dark:bg-purple-400/20 rounded-full animate-bounce"
        style={{ animationDuration: "2s" }}
      />

      {/* Payment stream visualization */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-32">
          {/* Source */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-indigo-600 dark:bg-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>

          {/* Destination */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-16 h-16 bg-indigo-600 dark:bg-indigo-400 rounded-lg flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </div>

          {/* Stream animation */}
          <div className="absolute top-1/2 left-16 right-16 h-2 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 transform -translate-y-1/2">
            <div className="absolute inset-0 flex space-x-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-4 bg-white rounded-full animate-stream"
                  style={{
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: "2s",
                    animationIterationCount: "infinite",
                    animationName: "streamAnimation",
                    animationTimingFunction: "linear",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div
        className="absolute top-5 left-5 w-8 h-8 border-2 border-indigo-500/50 dark:border-indigo-400/50 rounded-md animate-spin"
        style={{ animationDuration: "10s" }}
      />
      <div
        className="absolute bottom-5 right-5 w-8 h-8 border-2 border-blue-500/50 dark:border-blue-400/50 rounded-full animate-spin"
        style={{ animationDuration: "15s" }}
      />
      <div
        className="absolute top-5 right-10 w-4 h-4 bg-purple-500/50 dark:bg-purple-400/50 rounded-full animate-ping"
        style={{ animationDuration: "4s" }}
      />
    </div>
  );
}
