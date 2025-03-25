"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimatedGraphics } from "@/components/animated-graphics";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  // Using theme context for dark mode support
  useTheme();

  return (
    <div className="container mx-auto py-12 px-4 transition-colors duration-200">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
            Welcome to Pay Stream
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A modern payment streaming platform with secure authentication
          </p>
          <AnimatedGraphics />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card
            className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader>
              <h2 className="text-2xl font-bold">Authentication System</h2>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This platform includes a complete authentication system with:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Email-based login and registration</li>
                <li>Secure password handling</li>
                <li>Password reset functionality</li>
                <li>Protected routes for authenticated users</li>
                <li>JWT-based authentication</li>
              </ul>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="w-full sm:w-auto">Sign up</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card
            className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader>
              <h2 className="text-2xl font-bold">Features</h2>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                The authentication system provides these key features:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Client-side form validation</li>
                <li>Responsive design for all devices</li>
                <li>Secure token storage</li>
                <li>Automatic redirection after authentication</li>
                <li>User profile management</li>
              </ul>
              <Link href="/profile">
                <Button variant="outline" className="w-full">
                  View Profile (Protected Route)
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card
            className="border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md col-span-2 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <CardHeader>
              <h2 className="text-2xl font-bold">Technical Implementation</h2>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                This authentication system is built with modern web
                technologies:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Next.js 15 with App Router</li>
                <li>React 19 with React Server Components</li>
                <li>TypeScript for type safety</li>
                <li>TailwindCSS for styling</li>
                <li>JWT for secure authentication</li>
                <li>Client-side form validation</li>
                <li>Responsive UI components</li>
                <li>Light and dark mode support</li>
              </ul>
            </CardContent>
          </Card>

          {/* <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <HealthCheck />
          </div> */}
        </div>
      </div>
    </div>
  );
}
