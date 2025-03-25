import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FormProps extends HTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function Form({ children, className, onSubmit, ...props }: FormProps) {
  return (
    <form className={cn("space-y-6", className)} onSubmit={onSubmit} {...props}>
      {children}
    </form>
  );
}

interface FormHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function FormHeader({
  title,
  description,
  className,
  ...props
}: FormHeaderProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
}

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  label?: string;
  htmlFor?: string;
}

export function FormField({
  children,
  label,
  htmlFor,
  className,
  ...props
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      {children}
    </div>
  );
}

interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  error?: string;
}

export function FormError({ error, className, ...props }: FormErrorProps) {
  if (!error) return null;

  return (
    <p className={cn("text-sm font-medium text-red-500", className)} {...props}>
      {error}
    </p>
  );
}

interface FormSuccessProps extends HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormSuccess({
  message,
  className,
  ...props
}: FormSuccessProps) {
  if (!message) return null;

  return (
    <p
      className={cn("text-sm font-medium text-green-500", className)}
      {...props}
    >
      {message}
    </p>
  );
}
