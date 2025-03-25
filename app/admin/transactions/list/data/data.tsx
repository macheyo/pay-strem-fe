import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  UpdateIcon,
} from "@radix-ui/react-icons";
import { ExternalLinkIcon, icons } from "lucide-react";

export const statuses = [
  {
    value: "APPROVED",
    label: "Approved",
    icon: CheckCircledIcon,
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: CrossCircledIcon,
  },
  {
    value: "PENDING_APPROVAL",
    label: "Pending Approval",
    icon: UpdateIcon,
  },
  {
    value: "SUBMITTED",
    label: "Submitted",
    icon: ExternalLinkIcon,
  },
  {
    value: "COMPLETED",
    label: "Completed",
    icon: CheckCircledIcon,
  },
  {
    value: "FAILED",
    label: "Failed",
    icon: ExclamationTriangleIcon,
  },
];
