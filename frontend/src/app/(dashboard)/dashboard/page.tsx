"use client";

import PageContainer from "@/components/layout/PageContainer";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageContainer>
      <div>
        <p className="text-sm font-medium text-slate-500">Overview</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Welcome back, {user?.name ?? "User"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your business operations.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["Customers", "Products", "Stock Units", "Challans"].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">{item}</p>

            <p className="mt-3 text-3xl font-bold text-slate-900">—</p>

            <p className="mt-2 text-xs text-slate-400">Data will appear here</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
