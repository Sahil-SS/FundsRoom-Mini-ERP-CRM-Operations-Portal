"use client";

import { AlertTriangle, Package, Boxes } from "lucide-react";

interface InventorySummaryProps {
  totalProducts: number;
  totalUnits: number;
  lowStockProducts: number;
}

export default function InventorySummary({
  totalProducts,
  totalUnits,
  lowStockProducts,
}: InventorySummaryProps) {
  const cards = [
    {
      label: "Products",
      value: totalProducts,
      description: "Products being tracked",
      icon: Package,
    },
    {
      label: "Total Units",
      value: totalUnits,
      description: "Units currently in stock",
      icon: Boxes,
    },
    {
      label: "Low Stock",
      value: lowStockProducts,
      description: "Products at or below minimum",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                  {card.value.toLocaleString("en-IN")}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  {card.description}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
