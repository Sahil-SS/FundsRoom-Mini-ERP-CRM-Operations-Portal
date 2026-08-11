"use client";

import {
  Building2,
  CalendarDays,
  FileText,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Tag,
  User,
} from "lucide-react";

import StatusBadge from "@/components/common/StatusBadge";

import type { Customer } from "@/types/customer";

interface CustomerDetailsProps {
  customer: Customer;
}

function formatType(type: Customer["type"]) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function CustomerDetails({ customer }: CustomerDetailsProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-bold text-white">
              {customer.name.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-950">
                {customer.name}
              </h3>

              {customer.businessName && (
                <p className="mt-1 text-sm text-slate-500">
                  {customer.businessName}
                </p>
              )}

              <div className="mt-3">
                <StatusBadge status={customer.status} />
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Customer Type
            </p>

            <p className="mt-1 font-semibold text-slate-800">
              {formatType(customer.type)}
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 xl:grid-cols-3">
          <InfoItem icon={Phone} label="Mobile" value={customer.mobile} />

          <InfoItem icon={Mail} label="Email" value={customer.email} />

          <InfoItem
            icon={Building2}
            label="Business"
            value={customer.businessName}
          />

          <InfoItem
            icon={ReceiptText}
            label="GST Number"
            value={customer.gstNumber}
          />

          <InfoItem
            icon={CalendarDays}
            label="Next Follow-up"
            value={formatDate(customer.followUpDate)}
          />

          <InfoItem
            icon={Tag}
            label="Customer Type"
            value={formatType(customer.type)}
          />

          <div className="sm:col-span-2 xl:col-span-3">
            <InfoItem icon={MapPin} label="Address" value={customer.address} />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <FileText className="h-4 w-4" />
            </div>

            <div>
              <h3 className="font-semibold text-slate-900">Customer Notes</h3>

              <p className="text-xs text-slate-500">Internal CRM notes</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
            {customer.notes || "No notes added."}
          </p>
        </div>
      </section>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 wrap-break-word text-sm font-medium text-slate-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}
