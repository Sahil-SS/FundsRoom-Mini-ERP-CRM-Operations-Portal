import { AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface LowStockAlertProps {
  count: number;
}

export default function LowStockAlert({ count }: LowStockAlertProps) {
  const hasLowStock = count > 0;

  return (
    <section
      className={[
        "rounded-xl border p-5 shadow-sm",
        hasLowStock
          ? "border-amber-200 bg-amber-50/60"
          : "border-emerald-200 bg-emerald-50/60",
      ].join(" ")}
    >
      <div className="flex items-start gap-4">
        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            hasLowStock
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700",
          ].join(" ")}
        >
          {hasLowStock ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <span className="text-lg font-bold">✓</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">
            {hasLowStock
              ? "Low Stock Attention Required"
              : "Inventory Looks Healthy"}
          </h3>

          <p className="mt-1 text-sm leading-6 text-slate-600">
            {hasLowStock
              ? `${count} ${
                  count === 1 ? "product is" : "products are"
                } currently at or below the minimum stock level.`
              : "No products are currently at or below their minimum stock level."}
          </p>

          {hasLowStock && (
            <Link href="/inventory">
              <Button
                variant="link"
                className="mt-2 h-auto p-0 font-semibold text-amber-800"
              >
                Review inventory
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
