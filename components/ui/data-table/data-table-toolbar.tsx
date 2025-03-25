"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableViewOptions } from "./data-table-view-options";
import { FilterableColumn } from "@/lib/types";

interface Props<TData> {
  filterPlaceholder?: string;
  table: Table<TData>;
  filterableColumns?: FilterableColumn<TData>[];
  filterColumnId?: keyof TData;
}

export function DataTableToolbar<TData>({
  table,
  filterPlaceholder = "Filter...",
  filterableColumns = [],
  filterColumnId, // Allow the user to optionally pass a column for text input filtering
}: Props<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {/* Dynamic filter for the text input based on filterColumnId */}
        {filterColumnId && (
          <Input
            placeholder={filterPlaceholder}
            value={
              (table
                .getColumn(filterColumnId as string)
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn(filterColumnId as string)
                ?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}

        {/* Dynamically render filters for specified filterable columns */}
        {filterableColumns.map((filterColumn) => {
          const column = table.getColumn(filterColumn.columnId as string); // Cast to string
          return (
            column && (
              <DataTableFacetedFilter
                key={String(filterColumn.columnId)} // Ensure the key is a string
                column={column}
                title={filterColumn.title}
                options={filterColumn.options}
              />
            )
          );
        })}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {/* Pass table to DataTableViewOptions as is */}
      <DataTableViewOptions table={table} />
    </div>
  );
}
