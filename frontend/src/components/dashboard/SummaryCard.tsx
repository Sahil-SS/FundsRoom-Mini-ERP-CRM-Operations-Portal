import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
}

export default function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName = "bg-slate-100 text-slate-700",
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-400">{description}</p>
    </div>
  );
}
