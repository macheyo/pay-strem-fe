// Authentication API client for interacting with the backend service

// Types for authentication
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export type UserRole = "TRANSACTION_CREATOR" | "TRANSACTION_APPROVER" | "ADMIN";

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ResetPasswordConfirmation {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// API base URL - replace with your actual backend URL
const NEXT_PUBLIC_API_HOST =
  process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3000";

import { showToast, showValidationErrorToast } from "./toast";

// API error interface
interface ApiError {
  title?: string;
  status?: number;
  message?: string;
  violations?: Array<{
    field: string;
    message: string;
  }>;
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as ApiError;

    // Handle validation errors with violations
    if (error.violations && error.violations.length > 0) {
      showValidationErrorToast(error.violations);

      // Throw error with first violation message for backwards compatibility
      throw new Error(error.violations[0].message);
    }

    // Handle regular errors
    const errorMessage =
      error.message || error.title || "An error occurred during the request";

    // Show error toast
    showToast(errorMessage, "error");

    throw new Error(errorMessage);
  }
  return response.json() as Promise<T>;
}

// Authentication API client
export const authApi = {
  // Login with email and password
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${NEXT_PUBLIC_API_HOST}/api/v1/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const result = await handleResponse<AuthResponse>(response);
    showToast("Login successful", "success");
    return result;
  },

  // Register a new user
  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await fetch(
      `${NEXT_PUBLIC_API_HOST}/api/v1/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }
    );

    const result = await handleResponse<AuthResponse>(response);
    showToast("Account created successfully", "success");
    return result;
  },

  // Request a password reset
  async requestPasswordReset(
    request: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${NEXT_PUBLIC_API_HOST}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      }
    );

    const result = await handleResponse<{ message: string }>(response);
    showToast("Password reset instructions sent to your email", "success");
    return result;
  },

  // Confirm password reset with token and new password
  async confirmPasswordReset(
    confirmation: ResetPasswordConfirmation
  ): Promise<{ message: string }> {
    const response = await fetch(
      `${NEXT_PUBLIC_API_HOST}/auth/reset-password/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(confirmation),
      }
    );

    const result = await handleResponse<{ message: string }>(response);
    showToast("Password reset successful", "success");
    return result;
  },

  // Get the current user (for protected routes)
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${NEXT_PUBLIC_API_HOST}/api/v1/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse<User>(response);
  },
};

// Function to decode JWT token
function decodeJWT(token: string) {
  try {
    // JWT tokens are split into three parts: header, payload, and signature
    // We only need the payload part which is the second part
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

// Cookie name for storing the JWT token
const AUTH_COOKIE_NAME = "auth_token";

// Get session data from JWT token
export async function getSession() {
  let token;

  if (typeof window === "undefined") {
    // Server-side - we can't reliably get cookies in a function
    // The page component should handle this directly
    console.log("Server-side getSession called - not supported in functions");
    return null;
  } else {
    // Client-side - get token from localStorage
    token = localStorage.getItem("auth_token");
  }

  if (!token) {
    return null;
  }

  // Decode the JWT to get the payload
  const decodedToken = decodeJWT(token);
  if (!decodedToken) {
    return null;
  }

  console.log("JWT decoded successfully:", decodedToken);

  // Return session data including the JWT payload
  return {
    user: {
      id: decodedToken.sub || decodedToken.id,
      name: decodedToken.name,
      email: decodedToken.email,
      roles: decodedToken.roles || [],
      tenantId: decodedToken.tenantId,
      // Include all JWT claims in the rawClaims property
      rawClaims: decodedToken,
    },
    token,
  };
}

// Set a cookie with the JWT token
export function setAuthCookie(token: string) {
  if (typeof document !== "undefined") {
    // Set cookie that's accessible by the server (httpOnly: true would be better for security)
    document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=86400; SameSite=Strict`;
  }
}

// Clear the auth cookie
export function clearAuthCookie() {
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

// Client-side authentication utilities
export const auth = {
  // Store the authentication token in localStorage and cookie
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
      setAuthCookie(token); // Also set as cookie for server access
    }
  },

  // Get the authentication token from localStorage
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  },

  // Remove the authentication token from localStorage and cookie
  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
      clearAuthCookie();
    }
  },

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Logout the user
  logout(): void {
    this.removeToken();
  },
};
