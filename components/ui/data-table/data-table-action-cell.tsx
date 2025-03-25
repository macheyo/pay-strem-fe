import { useRouter } from "next/navigation";
import { DataTableRowActions } from "./data-table-row-actions";

interface Props {
  row: any;
  onEditUrl?: string | null;
  onViewUrl?: string | null;
  onDeleteUrl?: string | null;
}

export const ActionsCell = ({
  row,
  onEditUrl,
  onViewUrl,
  onDeleteUrl,
}: Readonly<Props>) => {
  const router = useRouter();

  const onEdit = (rowData: any) => {
    const id = rowData.id;
    if (id && onEditUrl) {
      router.push(onEditUrl);
    }
  };

  const onView = (rowData: any) => {
    const id = rowData.id;
    if (id && onViewUrl) {
      router.push(onViewUrl);
    }
  };

  const onDelete = (rowData: any) => {
    const id = rowData.id;
    if (id) {
      // Add delete logic here
    }
  };

  return <DataTableRowActions {...{ onEdit, onView, onDelete, row }} />;
};
