import { CheckCircle2, FileText, XCircle } from "lucide-react";

import type { DashboardChallanStats } from "@/types/dashboard";

interface ChallanSummaryProps {
  data: DashboardChallanStats;
}

export default function ChallanSummary({ data }: ChallanSummaryProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
          <FileText className="h-4.5 w-4.5" />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900">Challan Status</h3>

          <p className="text-xs text-slate-500">
            Current sales challan distribution
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

            <span className="text-sm font-medium text-slate-600">
              Confirmed
            </span>
          </div>

          <span className="font-bold text-slate-900">{data.confirmed}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />

            <span className="text-sm font-medium text-slate-600">Draft</span>
          </div>

          <span className="font-bold text-slate-900">{data.draft}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-red-600" />

            <span className="text-sm font-medium text-slate-600">
              Cancelled
            </span>
          </div>

          <span className="font-bold text-slate-900">{data.cancelled}</span>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-900">
              Total Challans
            </span>

            <span className="text-lg font-bold text-slate-900">
              {data.total}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
