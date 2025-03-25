"use client";

import { AdminLayout } from "@/components/admin/layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

// Define types for API documentation
interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  requestBody?: Record<string, unknown>;
  responseBody?: Record<string, unknown>;
  queryParams?: Record<string, string>;
}

interface ApiSection {
  id: string;
  title: string;
  description: string;
  endpoints: ApiEndpoint[];
}

// Sample API endpoints documentation
const apiEndpoints: ApiSection[] = [
  {
    id: "authentication",
    title: "Authentication",
    description: "Endpoints for user authentication and authorization",
    endpoints: [
      {
        method: "POST",
        path: "/api/v1/auth/login",
        description: "Authenticate a user and get an access token",
        requestBody: {
          email: "string",
          password: "string",
        },
        responseBody: {
          user: {
            id: "string",
            email: "string",
            name: "string",
          },
          token: "string",
        },
      },
      {
        method: "POST",
        path: "/api/v1/auth/register",
        description: "Register a new user account",
        requestBody: {
          email: "string",
          password: "string",
          firstName: "string",
          lastName: "string",
          role: "TRANSACTION_CREATOR | TRANSACTION_APPROVER | ADMIN",
          tenantId: "string",
        },
        responseBody: {
          user: {
            id: "string",
            email: "string",
            name: "string",
          },
          token: "string",
        },
      },
    ],
  },
  {
    id: "transactions",
    title: "Transactions",
    description: "Endpoints for managing transactions",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/transactions",
        description: "Get a list of transactions",
        queryParams: {
          page: "number (optional)",
          limit: "number (optional)",
          status: "string (optional)",
          startDate: "date (optional)",
          endDate: "date (optional)",
        },
        responseBody: {
          data: [
            {
              id: "string",
              amount: "number",
              description: "string",
              status: "string",
              createdAt: "date",
              updatedAt: "date",
            },
          ],
          pagination: {
            total: "number",
            page: "number",
            limit: "number",
            pages: "number",
          },
        },
      },
      {
        method: "POST",
        path: "/api/v1/transactions",
        description: "Create a new transaction",
        requestBody: {
          amount: "number",
          description: "string",
          recipientId: "string",
          metadata: "object (optional)",
        },
        responseBody: {
          id: "string",
          amount: "number",
          description: "string",
          status: "string",
          createdAt: "date",
          updatedAt: "date",
        },
      },
      {
        method: "GET",
        path: "/api/v1/transactions/:id",
        description: "Get a specific transaction by ID",
        responseBody: {
          id: "string",
          amount: "number",
          description: "string",
          status: "string",
          createdAt: "date",
          updatedAt: "date",
          metadata: "object",
        },
      },
    ],
  },
  {
    id: "batches",
    title: "Batches",
    description: "Endpoints for managing transaction batches",
    endpoints: [
      {
        method: "GET",
        path: "/api/v1/batches",
        description: "Get a list of transaction batches",
        queryParams: {
          page: "number (optional)",
          limit: "number (optional)",
          status: "string (optional)",
        },
        responseBody: {
          data: [
            {
              id: "string",
              description: "string",
              status: "string",
              transactionCount: "number",
              totalAmount: "number",
              createdAt: "date",
              updatedAt: "date",
            },
          ],
          pagination: {
            total: "number",
            page: "number",
            limit: "number",
            pages: "number",
          },
        },
      },
      {
        method: "POST",
        path: "/api/v1/batches",
        description: "Create a new transaction batch",
        requestBody: {
          description: "string",
          transactions: [
            {
              amount: "number",
              description: "string",
              recipientId: "string",
              metadata: "object (optional)",
            },
          ],
        },
        responseBody: {
          id: "string",
          description: "string",
          status: "string",
          transactionCount: "number",
          totalAmount: "number",
          createdAt: "date",
          updatedAt: "date",
        },
      },
    ],
  },
];

export default function ApiDocumentationPage() {
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    authentication: true,
    transactions: false,
    batches: false,
  });

  const [expandedEndpoints, setExpandedEndpoints] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (sectionId: string) => {
    setExpandedSections({
      ...expandedSections,
      [sectionId]: !expandedSections[sectionId],
    });
  };

  const toggleEndpoint = (endpointId: string) => {
    setExpandedEndpoints({
      ...expandedEndpoints,
      [endpointId]: !expandedEndpoints[endpointId],
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              API Documentation
            </h1>
            <p className="text-muted-foreground">
              Reference documentation for the PayStream API
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Swagger</span>
          </Button>
        </div>

        <div className="space-y-4">
          {apiEndpoints.map((section) => (
            <Card key={section.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div
                  className="flex cursor-pointer items-center justify-between"
                  onClick={() => toggleSection(section.id)}
                >
                  <div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {expandedSections[section.id] && (
                <CardContent>
                  <div className="space-y-4">
                    {section.endpoints.map((endpoint, index) => {
                      const endpointId = `${section.id}-${index}`;
                      return (
                        <div
                          key={endpointId}
                          className="rounded-md border overflow-hidden"
                        >
                          <div
                            className="flex cursor-pointer items-center justify-between bg-muted/50 p-3"
                            onClick={() => toggleEndpoint(endpointId)}
                          >
                            <div className="flex items-center space-x-3">
                              <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  endpoint.method === "GET"
                                    ? "bg-blue-100 text-blue-800"
                                    : endpoint.method === "POST"
                                    ? "bg-green-100 text-green-800"
                                    : endpoint.method === "PUT"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {endpoint.method}
                              </span>
                              <code className="text-sm font-mono">
                                {endpoint.path}
                              </code>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(endpoint.path);
                                }}
                              >
                                <Copy className="h-3.5 w-3.5" />
                                <span className="sr-only">Copy</span>
                              </Button>
                              {expandedEndpoints[endpointId] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                          {expandedEndpoints[endpointId] && (
                            <div className="p-4 space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">
                                  Description
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {endpoint.description}
                                </p>
                              </div>

                              {endpoint.queryParams && (
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Query Parameters
                                  </h4>
                                  <div className="rounded-md border overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead>
                                        <tr className="border-b bg-muted/50">
                                          <th className="py-2 px-4 text-left">
                                            Parameter
                                          </th>
                                          <th className="py-2 px-4 text-left">
                                            Type
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {Object.entries(
                                          endpoint.queryParams
                                        ).map(([param, type]) => (
                                          <tr
                                            key={param}
                                            className="border-b last:border-0"
                                          >
                                            <td className="py-2 px-4 font-mono text-xs">
                                              {param}
                                            </td>
                                            <td className="py-2 px-4">
                                              {type}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              {endpoint.requestBody && (
                                <div>
                                  <h4 className="font-medium mb-2">
                                    Request Body
                                  </h4>
                                  <div className="rounded-md bg-muted p-3">
                                    <pre className="text-xs font-mono overflow-x-auto">
                                      {JSON.stringify(
                                        endpoint.requestBody,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  </div>
                                </div>
                              )}

                              {endpoint.responseBody && (
                                <div>
                                  <h4 className="font-medium mb-2">Response</h4>
                                  <div className="rounded-md bg-muted p-3">
                                    <pre className="text-xs font-mono overflow-x-auto">
                                      {JSON.stringify(
                                        endpoint.responseBody,
                                        null,
                                        2
                                      )}
                                    </pre>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
