"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { ZodSchema } from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  schema?: ZodSchema<TData>; // Any Zod schema for row validation
  labels?: { label: string; value: string }[]; // Dynamic labels
  onEdit?: (data: TData) => void; // Callback for editing
  onDelete?: (data: TData) => void; // Callback for deleting
  onView?: (data: TData) => void; // Callback for viewing
  additionalActions?: React.ReactNode; // Additional menu actions
}

export function DataTableRowActions<TData>({
  row,
  schema,
  labels = [],
  onEdit,
  onDelete,
  onView,
  additionalActions,
}: DataTableRowActionsProps<TData>) {
  // Validate row data if schema is provided
  let rowData;
  if (schema) {
    try {
      rowData = schema.parse(row.original);
    } catch (e) {
      console.error("Schema validation failed", e);
      return <div>Invalid row data</div>; // Handle invalid data
    }
  } else {
    rowData = row.original;
  }

  // Type guard to check if 'label' exists on rowData
  const hasLabel = (data: unknown): data is { label: string } =>
    typeof data === "object" && data !== null && "label" in data;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {onView && (
          <DropdownMenuItem
            onClick={() => onView(rowData)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            View
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem
            onClick={() => onEdit(rowData)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}
        {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        {labels.length > 0 && hasLabel(rowData) && (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={rowData.label}>
                {labels.map((label) => (
                  <DropdownMenuRadioItem key={label.value} value={label.value}>
                    {label.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        {additionalActions && (
          <>
            <DropdownMenuSeparator />
            {additionalActions}
          </>
        )}
        <DropdownMenuSeparator />
        {onDelete && (
          <DropdownMenuItem
            onClick={() => onDelete(rowData)}
            className="flex items-center gap-2 text-red-600 hover:bg-red-100"
          >
            <Trash className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
