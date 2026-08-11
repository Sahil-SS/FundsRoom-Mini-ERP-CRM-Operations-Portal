"use client";

import { Boxes, FileText, Package, Users } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";

import SummaryCard from "@/components/dashboard/SummaryCard";
import CustomerSummary from "@/components/dashboard/CustomerSummary";
import ChallanSummary from "@/components/dashboard/ChallanSummary";
import LowStockAlert from "@/components/dashboard/LowStockAlert";

import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  const { data: response, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !response?.success) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Unable to load dashboard
          </h2>

          <p className="mt-1 text-sm text-red-700">{getErrorMessage(error)}</p>

          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      </PageContainer>
    );
  }

  const dashboard = response.data;

  return (
    <PageContainer>
      <div>
        <p className="text-sm font-medium text-slate-500">Overview</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
          Welcome back, {user?.name ?? "User"}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Here&apos;s an overview of your business operations.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Customers"
          value={dashboard.customers.total}
          description={`${dashboard.customers.active} active · ${dashboard.customers.leads} leads`}
          icon={Users}
          iconClassName="bg-blue-50 text-blue-700"
        />

        <SummaryCard
          title="Products"
          value={dashboard.products.total}
          description={`${dashboard.products.lowStock} currently low on stock`}
          icon={Package}
          iconClassName="bg-violet-50 text-violet-700"
        />

        <SummaryCard
          title="Stock Units"
          value={dashboard.inventory.totalStockUnits.toLocaleString()}
          description="Total units currently in inventory"
          icon={Boxes}
          iconClassName="bg-emerald-50 text-emerald-700"
        />

        <SummaryCard
          title="Challans"
          value={dashboard.challans.total}
          description={`${dashboard.challans.confirmed} confirmed · ${dashboard.challans.draft} draft`}
          icon={FileText}
          iconClassName="bg-slate-100 text-slate-700"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <CustomerSummary data={dashboard.customers} />

        <ChallanSummary data={dashboard.challans} />
      </div>

      <div className="mt-6">
        <LowStockAlert count={dashboard.products.lowStock} />
      </div>
    </PageContainer>
  );
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return (
      axiosError.response?.data?.message ??
      "The server returned an unexpected error."
    );
  }

  return "Please check that the backend is running and try again.";
}

function DashboardSkeleton() {
  return (
    <PageContainer>
      <div>
        <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-8 w-72 animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-9 w-20 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-3 w-36 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white" />
        <div className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white" />
      </div>

      <div className="mt-6 h-32 animate-pulse rounded-xl border border-slate-200 bg-white" />
    </PageContainer>
  );
}
