import { AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface ProductStockBadgeProps {
  currentStock: number;
  minimumStock: number;
}

export default function ProductStockBadge({
  currentStock,
  minimumStock,
}: ProductStockBadgeProps) {
  const isLowStock = currentStock <= minimumStock;

  if (isLowStock) {
    return (
      <Badge
        variant="outline"
        className="border-amber-200 bg-amber-50 text-amber-700"
      >
        <AlertTriangle className="mr-1 h-3.5 w-3.5" />
        {currentStock} · Low
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="border-emerald-200 bg-emerald-50 text-emerald-700"
    >
      {currentStock} · In stock
    </Badge>
  );
}
