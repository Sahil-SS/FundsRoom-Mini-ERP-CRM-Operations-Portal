"use client";

import MovementTypeBadge from "@/components/inventory/MovementTypeBadge";

import type { InventoryMovement } from "@/types/inventory";

interface MovementTableProps {
  movements: InventoryMovement[];
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function MovementTable({ movements }: MovementTableProps) {
  if (movements.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="font-semibold text-slate-900">No movements found</p>

        <p className="mt-1 text-sm text-slate-500">
          Inventory movement history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225 text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Product
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Type
              </th>

              <th className="px-5 py-3.5 text-right font-semibold text-slate-600">
                Quantity
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Reason
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Created By
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => (
              <tr
                key={movement.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {movement.product?.name || movement.productId}
                  </p>

                  {movement.product?.sku && (
                    <code className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                      {movement.product.sku}
                    </code>
                  )}
                </td>

                <td className="px-5 py-4">
                  <MovementTypeBadge type={movement.type} />
                </td>

                <td className="px-5 py-4 text-right font-semibold text-slate-800">
                  {movement.quantity.toLocaleString("en-IN")}
                </td>

                <td className="max-w-65 px-5 py-4 text-slate-600">
                  <p className="truncate">{movement.reason || "—"}</p>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {movement.createdBy?.name || "—"}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                  {formatDate(movement.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
