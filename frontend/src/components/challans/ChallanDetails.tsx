"use client";

import { CalendarDays, Download, UserRound } from "lucide-react";

import type { Challan } from "@/types/challan";

import ChallanStatusBadge from "@/components/challans/ChallanStatusBadge";
import { Button } from "@/components/ui/button";

import { downloadChallanPdf } from "@/lib/pdf/challanPdf";

interface ChallanDetailsProps {
  challan: Challan;
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
    timeStyle: "short",
  }).format(date);
}

export default function ChallanDetails({ challan }: ChallanDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Summary */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Sales Challan
              </p>

              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                {challan.challanNumber}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => downloadChallanPdf(challan)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>

              <ChallanStatusBadge status={challan.status} />
            </div>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Customer" value={challan.customer?.name ?? "—"} />

          <InfoItem
            label="Business"
            value={challan.customer?.businessName ?? "—"}
          />

          <InfoItem label="Created By" value={challan.createdBy?.name ?? "—"} />

          <InfoItem label="Created" value={formatDate(challan.createdAt)} />
        </div>
      </section>

      {/* Items */}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Products</h2>

          <p className="mt-1 text-sm text-slate-500">
            Products and prices captured when this challan was created.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  Product
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-600">
                  SKU
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  Quantity
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  Unit Price
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-600">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {challan.items.map((item) => {
                const lineTotal =
                  Number(item.unitPriceSnapshot) * item.quantity;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {item.productNameSnapshot}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {item.skuSnapshot}
                    </td>

                    <td className="px-5 py-4 text-right font-medium text-slate-700">
                      {item.quantity.toLocaleString("en-IN")}
                    </td>

                    <td className="px-5 py-4 text-right text-slate-700">
                      {formatCurrency(Number(item.unitPriceSnapshot))}
                    </td>

                    <td className="px-5 py-4 text-right font-semibold text-slate-900">
                      {formatCurrency(lineTotal)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals */}

        <div className="border-t border-slate-200 bg-slate-50 px-5 py-5">
          <div className="ml-auto max-w-sm space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Total Quantity</span>

              <span className="font-semibold text-slate-900">
                {challan.totalQuantity.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-3">
              <span className="font-semibold text-slate-700">Total Amount</span>

              <span className="text-xl font-bold text-slate-950">
                {formatCurrency(Number(challan.totalAmount))}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Metadata */}

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <UserRound className="h-4 w-4 text-slate-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Created By
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {challan.createdBy?.name ?? "—"}
              </p>

              {challan.createdBy?.role && (
                <p className="text-xs text-slate-500">
                  {challan.createdBy.role}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
              <CalendarDays className="h-4 w-4 text-slate-600" />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Last Updated
              </p>

              <p className="mt-1 font-medium text-slate-900">
                {formatDate(challan.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 font-medium text-slate-900">{value}</p>
    </div>
  );
}
