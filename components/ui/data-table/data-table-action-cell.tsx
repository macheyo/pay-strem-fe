import { useRouter } from "next/navigation";
import { DataTableRowActions } from "./data-table-row-actions";
import { Row } from "@tanstack/react-table";

// Generic interface for props
interface Props<TData> {
  row: Row<TData>;
  onEditUrl?: string | null;
  onViewUrl?: string | null;
  onDeleteUrl?: string | null;
}

export const ActionsCell = <TData,>({
  row,
  onEditUrl,
  onViewUrl,
  onDeleteUrl,
}: Readonly<Props<TData>>) => {
  const router = useRouter();

  const onEdit = (rowData: TData) => {
    // Check if rowData has an id property using type guard
    if (
      rowData &&
      typeof rowData === "object" &&
      "id" in rowData &&
      onEditUrl
    ) {
      router.push(onEditUrl);
    }
  };

  const onView = (rowData: TData) => {
    if (
      rowData &&
      typeof rowData === "object" &&
      "id" in rowData &&
      onViewUrl
    ) {
      router.push(onViewUrl);
    }
  };

  const onDelete = (rowData: TData) => {
    if (
      rowData &&
      typeof rowData === "object" &&
      "id" in rowData &&
      onDeleteUrl
    ) {
      router.push(onDeleteUrl);
    }
  };

  return (
    <DataTableRowActions
      row={row}
      onEdit={onEdit}
      onView={onView}
      onDelete={onDelete}
    />
  );
};
