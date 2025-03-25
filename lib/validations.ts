import { z } from "zod";

// Form validation utilities

/**
 * Validates an email address
 * @param email The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a password
 * @param password The password to validate
 * @returns An object with isValid and message properties
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message?: string;
} {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  return { isValid: true };
}

// Zod schemas for form validation
export const emailSchema = z.string().email("Invalid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number");

export const roleSchema = z.enum(
  ["TRANSACTION_CREATOR", "TRANSACTION_APPROVER", "ADMIN"],
  {
    errorMap: () => ({ message: "Please select a valid role" }),
  }
);

export const tenantSchema = z
  .string()
  .min(1, "Organization name is required")
  .max(100, "Organization name must be less than 100 characters");

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: roleSchema,
    tenant: tenantSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Validates login credentials
 * @param email The email address
 * @param password The password
 * @returns An object with errors for each field if invalid
 */
export function validateLogin(
  email: string,
  password: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  return errors;
}

/**
 * Validates signup credentials
 * @param email The email address
 * @param password The password
 * @param confirmPassword The password confirmation
 * @param firstName The user's first name
 * @param lastName The user's last name
 * @param role The user's role
 * @param tenant The organization name
 * @returns An object with errors for each field if invalid
 */
export function validateSignup(
  email: string,
  password: string,
  confirmPassword: string,
  firstName: string,
  lastName: string,
  role?: string,
  tenant?: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  try {
    // Use Zod schema for validation
    const result = signupSchema.safeParse({
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      role,
      tenant,
    });

    if (!result.success) {
      // Extract error messages from Zod validation result
      const formattedErrors = result.error.format();

      if (formattedErrors.email?._errors?.length) {
        errors.email = formattedErrors.email._errors[0];
      }

      if (formattedErrors.password?._errors?.length) {
        errors.password = formattedErrors.password._errors[0];
      }

      if (formattedErrors.confirmPassword?._errors?.length) {
        errors.confirmPassword = formattedErrors.confirmPassword._errors[0];
      }

      if (formattedErrors.firstName?._errors?.length) {
        errors.firstName = formattedErrors.firstName._errors[0];
      }

      if (formattedErrors.role?._errors?.length) {
        errors.role = formattedErrors.role._errors[0];
      }

      if (formattedErrors.tenant?._errors?.length) {
        errors.tenant = formattedErrors.tenant._errors[0];
      }
    }
  } catch (e) {
    console.error("Validation error:", e);
    // Fallback to manual validation if Zod validation fails
    if (!email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      errors.email = "Invalid email address";
    }

    if (!firstName) {
      errors.firstName = "First name is required";
    }

    if (!lastName) {
      errors.lastName = "Last name is required";
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message || "Invalid password";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!role) {
      errors.role = "Role is required";
    } else if (
      !["TRANSACTION_CREATOR", "TRANSACTION_APPROVER", "ADMIN"].includes(role)
    ) {
      errors.role = "Please select a valid role";
    }

    if (!tenant) {
      errors.tenant = "Organization name is required";
    } else if (tenant.length > 100) {
      errors.tenant = "Organization name must be less than 100 characters";
    }
  }

  return errors;
}

/**
 * Validates a password reset request
 * @param email The email address
 * @returns An object with errors for each field if invalid
 */
export function validatePasswordResetRequest(
  email: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!isValidEmail(email)) {
    errors.email = "Invalid email address";
  }

  return errors;
}

/**
 * Validates a password reset confirmation
 * @param password The new password
 * @param confirmPassword The password confirmation
 * @returns An object with errors for each field if invalid
 */
export function validatePasswordResetConfirmation(
  password: string,
  confirmPassword: string
): Record<string, string> {
  const errors: Record<string, string> = {};

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.message || "Invalid password";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
