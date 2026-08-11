import { Badge } from "@/components/ui/badge";

import type { CustomerStatus } from "@/types/customer";

interface StatusBadgeProps {
  status: CustomerStatus;
}

const statusConfig: Record<
  CustomerStatus,
  {
    label: string;
    className: string;
  }
> = {
  LEAD: {
    label: "Lead",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },

  ACTIVE: {
    label: "Active",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },

  INACTIVE: {
    label: "Inactive",
    className: "border-slate-200 bg-slate-100 text-slate-600",
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
