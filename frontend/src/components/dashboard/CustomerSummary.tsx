import { Users } from "lucide-react";

import type { DashboardCustomerStats } from "@/types/dashboard";

interface CustomerSummaryProps {
  data: DashboardCustomerStats;
}

export default function CustomerSummary({ data }: CustomerSummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
          <Users className="h-4.5 w-4.5" />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Customer Overview</h3>

          <p className="text-xs text-slate-500">
            Current CRM customer distribution
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 divide-x divide-slate-200">
        <div className="pr-4">
          <p className="text-xs font-medium text-slate-500">Total</p>

          <p className="mt-1 text-xl font-bold text-slate-900">{data.total}</p>
        </div>

        <div className="px-4">
          <p className="text-xs font-medium text-slate-500">Active</p>

          <p className="mt-1 text-xl font-bold text-emerald-600">
            {data.active}
          </p>
        </div>

        <div className="pl-4">
          <p className="text-xs font-medium text-slate-500">Leads</p>

          <p className="mt-1 text-xl font-bold text-amber-600">{data.leads}</p>
        </div>
      </div>
    </section>
  );
}
