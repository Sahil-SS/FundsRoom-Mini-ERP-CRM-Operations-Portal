"use client";

import {
  BadgeCheck,
  Building2,
  CalendarDays,
  FileText,
  ReceiptText,
  UserRound,
} from "lucide-react";

import type { Challan } from "@/types/challan";

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

export default function InvoiceDetails({ challan }: { challan: Challan }) {
  const invoiceNumber = `INV-${challan.challanNumber.replace(/^SC-/i, "")}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* =====================================================
          INVOICE HEADER
      ====================================================== */}

      <div className="border-b border-slate-200 px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
              <ReceiptText className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                FundsRoom Billing
              </p>

              <h2 className="mt-1 text-3xl font-black tracking-tight text-slate-950">
                TAX INVOICE
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Official billing document
              </p>
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Invoice Number
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              {invoiceNumber}
            </p>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <BadgeCheck className="h-4 w-4" />
              CONFIRMED
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          INVOICE META
      ====================================================== */}

      <div className="grid border-b border-slate-200 sm:grid-cols-2">
        <div className="border-b border-slate-200 p-6 sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <CalendarDays className="h-4 w-4" />
            Invoice Date
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(challan.updatedAt)}
          </p>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <FileText className="h-4 w-4" />
            Reference Challan
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {challan.challanNumber}
          </p>
        </div>
      </div>

      {/* =====================================================
          BILL FROM / BILL TO
      ====================================================== */}

      <div className="grid border-b border-slate-200 lg:grid-cols-2">
        <div className="border-b border-slate-200 p-6 lg:border-b-0 lg:border-r">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Bill From
          </p>

          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <Building2 className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <p className="font-bold text-slate-950">FundsRoom</p>

              <p className="mt-1 text-sm text-slate-500">
                ERP & Business Operations
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Sales & Distribution
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
            Bill To
          </p>

          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <UserRound className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <p className="font-bold text-slate-950">
                {challan.customer?.name ?? "—"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {challan.customer?.businessName ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          LINE ITEMS
      ====================================================== */}

      <div>
        <div className="border-b border-slate-200 px-6 py-4 sm:px-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Invoice Items
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-180">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  #
                </th>

                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Description
                </th>

                <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  SKU
                </th>

                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Qty
                </th>

                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Unit Price
                </th>

                <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Amount
                </th>
              </tr>
            </thead>

            <tbody>
              {challan.items.map((item, index) => {
                const quantity = Number(item.quantity);
                const unitPrice = Number(item.unitPriceSnapshot);
                const amount = quantity * unitPrice;

                return (
                  <tr
                    key={`${item.skuSnapshot}-${index}`}
                    className="border-t border-slate-100"
                  >
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {item.productNameSnapshot}
                    </td>

                    <td className="px-6 py-4 text-sm text-slate-500">
                      {item.skuSnapshot}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-700">
                      {quantity.toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                      {formatCurrency(unitPrice)}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-bold text-slate-950">
                      {formatCurrency(amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

      <div className="border-t border-slate-200 bg-slate-50 px-6 py-7 sm:px-8">
        <div className="ml-auto w-full max-w-md">
          <div className="flex items-center justify-between py-2 text-sm">
            <span className="text-slate-500">Total Quantity</span>

            <span className="font-semibold text-slate-900">
              {challan.totalQuantity.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="mt-3 border-t border-slate-200 pt-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Amount Payable
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Based on confirmed challan items
                </p>
              </div>

              <p className="text-2xl font-black tracking-tight text-slate-950">
                {formatCurrency(Number(challan.totalAmount))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <div className="flex flex-col gap-2 border-t border-slate-200 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          Invoice generated from confirmed challan{" "}
          <span className="font-semibold text-slate-600">
            {challan.challanNumber}
          </span>
        </p>

        <p>
          Created by{" "}
          <span className="font-semibold text-slate-600">
            {challan.createdBy?.name ?? "—"}
          </span>
        </p>
      </div>
    </div>
  );
}
