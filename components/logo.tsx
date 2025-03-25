"use client";

import React from "react";
import { useTheme } from "./theme-provider";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "" }) => {
  const { isDarkMode } = useTheme();
  const primaryColor = isDarkMode ? "#ffffff" : "#4F46E5";
  const secondaryColor = isDarkMode ? "#4F46E5" : "#ffffff";

  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Logo icon */}
        <rect width="50" height="50" rx="10" fill={primaryColor} />

        {/* Dollar sign */}
        <path
          d="M25 12C23.3431 12 22 13.3431 22 15V17H28V15C28 13.3431 26.6569 12 25 12Z"
          fill={secondaryColor}
        />
        <path
          d="M22 21V29C22 30.6569 23.3431 32 25 32C26.6569 32 28 30.6569 28 29V21H22Z"
          fill={secondaryColor}
        />
        <rect x="22" y="17" width="6" height="4" fill={secondaryColor} />

        {/* Stream lines */}
        <path
          d="M35 15H55"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M35 25H65"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M35 35H45"
          stroke={primaryColor}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span
        className={`ml-2 text-xl font-bold ${
          isDarkMode ? "text-white" : "text-indigo-600"
        }`}
      >
        Pay Stream
      </span>
    </div>
  );
};

export default Logo;
