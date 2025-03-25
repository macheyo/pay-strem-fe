import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Interface for decoded JWT user data
export interface JwtUser {
  id: string;
  name: string;
  email: string;
  roles: string[];
  tenantId?: string;
  rawClaims: Record<string, unknown>;
}

/**
 * Decodes a JWT token
 * @param token JWT token to decode
 * @returns Decoded token payload or null if invalid
 */
function decodeJwtToken(token: string): Record<string, unknown> | null {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf8");
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
}

/**
 * Gets the current user from the JWT token in cookies
 * For use in server components only
 */
export async function getServerSession(): Promise<{
  user: JwtUser;
  token: string;
} | null> {
  try {
    // Get the auth token from cookies
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth_token")?.value;

    if (!authToken) {
      console.log("No auth token found in cookies");
      return null;
    }

    // Decode the JWT token
    const decodedToken = decodeJwtToken(authToken);
    if (!decodedToken) {
      console.error("Failed to decode JWT token");
      return null;
    }

    // Extract user data from the token
    const user: JwtUser = {
      id: (decodedToken.sub as string) || (decodedToken.id as string) || "",
      name: (decodedToken.name as string) || "Unknown User",
      email: (decodedToken.email as string) || "unknown@example.com",
      roles: (decodedToken.roles as string[]) || [],
      tenantId: decodedToken.tenantId as string,
      rawClaims: decodedToken,
    };

    return {
      user,
      token: authToken,
    };
  } catch (error) {
    console.error("Error getting server session:", error);
    return null;
  }
}

/**
 * Middleware to require authentication
 * Redirects to login if no session is found
 */
export async function requireAuth() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}
