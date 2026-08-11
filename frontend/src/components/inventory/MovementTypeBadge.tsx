import { ArrowDown, ArrowUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";

import type { MovementType } from "@/types/inventory";

interface MovementTypeBadgeProps {
  type: MovementType;
}

export default function MovementTypeBadge({ type }: MovementTypeBadgeProps) {
  if (type === "IN") {
    return (
      <Badge
        variant="outline"
        className="border-emerald-200 bg-emerald-50 text-emerald-700"
      >
        <ArrowDown className="mr-1 h-3.5 w-3.5" />
        IN
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
      <ArrowUp className="mr-1 h-3.5 w-3.5" />
      OUT
    </Badge>
  );
}
