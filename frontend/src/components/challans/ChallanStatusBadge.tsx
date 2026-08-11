import { Badge } from "@/components/ui/badge";

import type { ChallanStatus } from "@/types/challan";

interface ChallanStatusBadgeProps {
  status: ChallanStatus;
}

export default function ChallanStatusBadge({
  status,
}: ChallanStatusBadgeProps) {
  if (status === "DRAFT") {
    return (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-700"
      >
        Draft
      </Badge>
    );
  }

  if (status === "CONFIRMED") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-emerald-700"
      >
        Confirmed
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-slate-200 bg-slate-100 text-slate-600"
    >
      Cancelled
    </Badge>
  );
}
