"use client";

import { Eye } from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import ChallanStatusBadge from "@/components/challans/ChallanStatusBadge";

import type { Challan } from "@/types/challan";

interface ChallanTableProps {
  challans: Challan[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
}

export default function ChallanTable({ challans }: ChallanTableProps) {
  const router = useRouter();

  if (challans.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="font-semibold text-slate-900">No challans found</p>

        <p className="mt-1 text-sm text-slate-500">
          Create a challan to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-237.5 text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Challan
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Customer
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Status
              </th>

              <th className="px-5 py-3.5 text-right font-semibold text-slate-600">
                Quantity
              </th>

              <th className="px-5 py-3.5 text-right font-semibold text-slate-600">
                Amount
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Created
              </th>

              <th className="w-20 px-5 py-3.5 text-right font-semibold text-slate-600">
                View
              </th>
            </tr>
          </thead>

          <tbody>
            {challans.map((challan) => (
              <tr
                key={challan.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">
                    {challan.challanNumber}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {challan.items?.length ?? 0} product
                    {(challan.items?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-slate-800">
                    {challan.customer?.name ?? "—"}
                  </p>

                  {challan.customer?.businessName && (
                    <p className="mt-1 text-xs text-slate-400">
                      {challan.customer.businessName}
                    </p>
                  )}
                </td>

                <td className="px-5 py-4">
                  <ChallanStatusBadge status={challan.status} />
                </td>

                <td className="px-5 py-4 text-right font-medium text-slate-700">
                  {challan.totalQuantity.toLocaleString("en-IN")}
                </td>

                <td className="px-5 py-4 text-right font-medium text-slate-700">
                  {formatCurrency(challan.totalAmount)}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                  {formatDate(challan.createdAt)}
                </td>

                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${challan.challanNumber}`}
                    onClick={() => router.push(`/challans/${challan.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
