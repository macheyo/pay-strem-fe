import * as React from "react";

export interface FilterableColumn<TData> {
  columnId: keyof TData | string;
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
    className?: string;
  }[];
}
