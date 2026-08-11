"use client";

import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  ChevronRight,
  FileText,
  Package,
  Plus,
  RefreshCw,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

import PageContainer from "@/components/layout/PageContainer";

import SummaryCard from "@/components/dashboard/SummaryCard";
import CustomerSummary from "@/components/dashboard/CustomerSummary";
import ChallanSummary from "@/components/dashboard/ChallanSummary";
import LowStockAlert from "@/components/dashboard/LowStockAlert";

import { Button } from "@/components/ui/button";

import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const router = useRouter();

  const { user } = useAuth();

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useDashboard();

  const [activeView, setActiveView] = useState<
    "overview" | "sales" | "customers"
  >("overview");

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !response?.success) {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-700" />
            </div>

            <div>
              <h2 className="font-semibold text-red-900">
                Unable to load dashboard
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {getErrorMessage(error)}
              </p>

              <Button
                type="button"
                variant="outline"
                className="mt-4 border-red-300 bg-white text-red-700 hover:bg-red-100"
                onClick={() => refetch()}
              >
                Try again
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  const dashboard = response.data;

  const customerTotal = dashboard.customers.total;

  const activeCustomers = dashboard.customers.active;

  const customerLeads = dashboard.customers.leads;

  const productTotal = dashboard.products.total;

  const lowStockProducts = dashboard.products.lowStock;

  const stockUnits = dashboard.inventory.totalStockUnits;

  const challanTotal = dashboard.challans.total;

  const confirmedChallans = dashboard.challans.confirmed;

  const draftChallans = dashboard.challans.draft;

  const cancelledChallans = dashboard.challans.cancelled;

  /*
   * Percentages are calculated only from
   * real API aggregate data.
   */

  const activeCustomerPercent =
    customerTotal > 0 ? Math.round((activeCustomers / customerTotal) * 100) : 0;

  const leadPercent =
    customerTotal > 0 ? Math.round((customerLeads / customerTotal) * 100) : 0;

  const confirmedPercent =
    challanTotal > 0 ? Math.round((confirmedChallans / challanTotal) * 100) : 0;

  const draftPercent =
    challanTotal > 0 ? Math.round((draftChallans / challanTotal) * 100) : 0;

  const cancelledPercent =
    challanTotal > 0 ? Math.round((cancelledChallans / challanTotal) * 100) : 0;

  const canCreateCustomer = user?.role === "ADMIN" || user?.role === "SALES";

  const canCreateChallan = user?.role === "ADMIN" || user?.role === "SALES";

  const canCreateProduct = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  return (
    <PageContainer>
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>

            <p className="text-sm font-semibold text-slate-500">
              Business Overview
            </p>
          </div>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Welcome back, {user?.name ?? "User"}
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Monitor customers, products, inventory, and sales operations from
            one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {canCreateChallan && (
            <Button type="button" onClick={() => router.push("/challans/new")}>
              <Plus className="mr-2 h-4 w-4" />
              New Challan
            </Button>
          )}
        </div>
      </div>

      {/* ======================================================
          VIEW SWITCHER
      ====================================================== */}

      <div className="mt-7 inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <DashboardTab
          active={activeView === "overview"}
          onClick={() => setActiveView("overview")}
        >
          Overview
        </DashboardTab>

        <DashboardTab
          active={activeView === "sales"}
          onClick={() => setActiveView("sales")}
        >
          Sales
        </DashboardTab>

        <DashboardTab
          active={activeView === "customers"}
          onClick={() => setActiveView("customers")}
        >
          Customers
        </DashboardTab>
      </div>

      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Customers"
          value={customerTotal}
          description={`${activeCustomers} active · ${customerLeads} leads`}
          icon={Users}
          iconClassName="bg-blue-50 text-blue-700"
        />

        <SummaryCard
          title="Products"
          value={productTotal}
          description={`${lowStockProducts} currently low on stock`}
          icon={Package}
          iconClassName="bg-violet-50 text-violet-700"
        />

        <SummaryCard
          title="Stock Units"
          value={stockUnits.toLocaleString("en-IN")}
          description="Total units currently in inventory"
          icon={Boxes}
          iconClassName="bg-emerald-50 text-emerald-700"
        />

        <SummaryCard
          title="Challans"
          value={challanTotal}
          description={`${confirmedChallans} confirmed · ${draftChallans} draft`}
          icon={FileText}
          iconClassName="bg-slate-100 text-slate-700"
        />
      </div>

      {/* ======================================================
          OVERVIEW
      ====================================================== */}

      {activeView === "overview" && (
        <>
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
            {/* Customer Analytics */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Customer Overview
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Current customer composition.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <Users className="h-4 w-4 text-blue-700" />
                </div>
              </div>

              <div className="mt-7 grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
                {/* Donut-style visualization */}

                <CustomerDonut
                  active={activeCustomers}
                  leads={customerLeads}
                  total={customerTotal}
                />

                <div className="space-y-5">
                  <MetricBar
                    label="Active Customers"
                    value={activeCustomers}
                    total={customerTotal}
                    percentage={activeCustomerPercent}
                    className="bg-blue-600"
                  />

                  <MetricBar
                    label="Leads"
                    value={customerLeads}
                    total={customerTotal}
                    percentage={leadPercent}
                    className="bg-amber-500"
                  />

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Customer Base
                    </p>

                    <p className="mt-1 text-2xl font-bold text-slate-950">
                      {customerTotal.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Total customers recorded
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Challan Analytics */}

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Challan Pipeline
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Current sales document status.
                  </p>
                </div>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <FileText className="h-4 w-4 text-slate-700" />
                </div>
              </div>

              <div className="mt-7">
                <ChallanBar
                  label="Confirmed"
                  value={confirmedChallans}
                  percentage={confirmedPercent}
                  icon={CheckCircle2}
                  iconClassName="text-emerald-600"
                  barClassName="bg-emerald-500"
                />

                <ChallanBar
                  label="Draft"
                  value={draftChallans}
                  percentage={draftPercent}
                  icon={FileText}
                  iconClassName="text-amber-600"
                  barClassName="bg-amber-500"
                />

                <ChallanBar
                  label="Cancelled"
                  value={cancelledChallans}
                  percentage={cancelledPercent}
                  icon={XCircle}
                  iconClassName="text-red-500"
                  barClassName="bg-red-500"
                />
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Total Challans
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-950">
                    {challanTotal}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-slate-400">Confirmation rate</p>

                  <p className="mt-1 text-lg font-bold text-emerald-600">
                    {confirmedPercent}%
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Inventory Health */}

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Inventory Health
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Current inventory position based on available stock data.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/inventory")}
              >
                View Inventory
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InventoryMetric
                icon={Boxes}
                title="Total Stock Units"
                value={stockUnits.toLocaleString("en-IN")}
                description="Units currently recorded"
                iconClassName="bg-emerald-50 text-emerald-700"
              />

              <InventoryMetric
                icon={Package}
                title="Tracked Products"
                value={productTotal.toLocaleString("en-IN")}
                description="Products in the catalog"
                iconClassName="bg-violet-50 text-violet-700"
              />

              <InventoryMetric
                icon={AlertTriangle}
                title="Low Stock"
                value={lowStockProducts.toLocaleString("en-IN")}
                description={
                  lowStockProducts === 0
                    ? "No low-stock products"
                    : "Products need attention"
                }
                iconClassName={
                  lowStockProducts === 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }
              />
            </div>

            <InventoryHealthBar
              lowStock={lowStockProducts}
              totalProducts={productTotal}
            />
          </section>

          {/* Existing dashboard components */}

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <CustomerSummary data={dashboard.customers} />

            <ChallanSummary data={dashboard.challans} />
          </div>

          <div className="mt-6">
            <LowStockAlert count={lowStockProducts} />
          </div>
        </>
      )}

      {/* ======================================================
          SALES VIEW
      ====================================================== */}

      {activeView === "sales" && (
        <div className="mt-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Sales Operations
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Review and manage sales challans.
                </p>
              </div>

              <Button type="button" onClick={() => router.push("/challans")}>
                Open Challans
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <SalesMetric title="Total" value={challanTotal} icon={FileText} />

              <SalesMetric
                title="Confirmed"
                value={confirmedChallans}
                icon={CheckCircle2}
              />

              <SalesMetric
                title="Pending Drafts"
                value={draftChallans}
                icon={TrendingUp}
              />
            </div>

            <div className="mt-8">
              <ChallanBar
                label="Confirmed"
                value={confirmedChallans}
                percentage={confirmedPercent}
                icon={CheckCircle2}
                iconClassName="text-emerald-600"
                barClassName="bg-emerald-500"
              />

              <ChallanBar
                label="Draft"
                value={draftChallans}
                percentage={draftPercent}
                icon={FileText}
                iconClassName="text-amber-600"
                barClassName="bg-amber-500"
              />

              <ChallanBar
                label="Cancelled"
                value={cancelledChallans}
                percentage={cancelledPercent}
                icon={XCircle}
                iconClassName="text-red-500"
                barClassName="bg-red-500"
              />
            </div>
          </section>
        </div>
      )}

      {/* ======================================================
          CUSTOMER VIEW
      ====================================================== */}

      {activeView === "customers" && (
        <div className="mt-6 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Customer Operations
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Monitor your current customer base.
                </p>
              </div>

              {canCreateCustomer && (
                <Button
                  type="button"
                  onClick={() => router.push("/customers/new")}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              )}
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <SalesMetric
                title="Total Customers"
                value={customerTotal}
                icon={Users}
              />

              <SalesMetric
                title="Active"
                value={activeCustomers}
                icon={CheckCircle2}
              />

              <SalesMetric
                title="Leads"
                value={customerLeads}
                icon={TrendingUp}
              />
            </div>

            <div className="mt-8">
              <MetricBar
                label="Active Customers"
                value={activeCustomers}
                total={customerTotal}
                percentage={activeCustomerPercent}
                className="bg-blue-600"
              />

              <MetricBar
                label="Leads"
                value={customerLeads}
                total={customerTotal}
                percentage={leadPercent}
                className="bg-amber-500"
              />
            </div>
          </section>

          <CustomerSummary data={dashboard.customers} />
        </div>
      )}

      {/* ======================================================
          QUICK ACTIONS
      ====================================================== */}

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-900">Quick Actions</p>

          <p className="mt-1 text-sm text-slate-500">
            Jump directly to common operational tasks.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {canCreateCustomer && (
            <QuickAction
              icon={UserPlus}
              title="Add Customer"
              description="Create a new CRM record"
              onClick={() => router.push("/customers/new")}
            />
          )}

          {canCreateProduct && (
            <QuickAction
              icon={Package}
              title="Add Product"
              description="Create a product"
              onClick={() => router.push("/products/new")}
            />
          )}

          <QuickAction
            icon={Boxes}
            title="View Inventory"
            description="Review current stock"
            onClick={() => router.push("/inventory")}
          />

          {canCreateChallan && (
            <QuickAction
              icon={FileText}
              title="Create Challan"
              description="Start a new sales challan"
              onClick={() => router.push("/challans/new")}
            />
          )}
        </div>
      </section>
    </PageContainer>
  );
}

/* ============================================================
   DASHBOARD TAB
============================================================ */

function DashboardTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
        active
          ? "bg-slate-900 text-white shadow-sm"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   CUSTOMER DONUT
============================================================ */

function CustomerDonut({
  active,
  leads,
  total,
}: {
  active: number;
  leads: number;
  total: number;
}) {
  const activePercentage = total > 0 ? (active / total) * 100 : 0;

  const leadPercentage = total > 0 ? (leads / total) * 100 : 0;

  const activeDash = Math.min(activePercentage, 100) * 2.2;

  const leadDash = Math.min(leadPercentage, 100) * 2.2;

  return (
    <div className="relative mx-auto h-40 w-40">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-slate-100"
        />

        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${activeDash} 276`}
          className="text-blue-600 transition-all duration-700"
        />

        <circle
          cx="60"
          cy="60"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${leadDash} 276`}
          strokeDashoffset={`-${activeDash}`}
          className="text-amber-500 transition-all duration-700"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-3xl font-bold text-slate-950">
          {total.toLocaleString("en-IN")}
        </p>

        <p className="text-xs font-medium text-slate-400">Customers</p>
      </div>
    </div>
  );
}

/* ============================================================
   METRIC BAR
============================================================ */

function MetricBar({
  label,
  value,
  total,
  percentage,
  className,
}: {
  label: string;
  value: number;
  total: number;
  percentage: number;
  className: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{label}</p>

        <p className="text-sm font-semibold text-slate-900">
          {value.toLocaleString("en-IN")}
          <span className="ml-1 text-xs font-normal text-slate-400">
            / {total.toLocaleString("en-IN")}
          </span>
        </p>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${className}`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>

      <p className="text-right text-xs text-slate-400">
        {percentage}% of total
      </p>
    </div>
  );
}

/* ============================================================
   CHALLAN BAR
============================================================ */

function ChallanBar({
  label,
  value,
  percentage,
  icon: Icon,
  iconClassName,
  barClassName,
}: {
  label: string;
  value: number;
  percentage: number;
  icon: React.ElementType;
  iconClassName: string;
  barClassName: string;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-center gap-3">
        <Icon className={`h-4 w-4 ${iconClassName}`} />

        <span className="flex-1 text-sm font-medium text-slate-700">
          {label}
        </span>

        <span className="text-sm font-semibold text-slate-900">{value}</span>

        <span className="w-12 text-right text-xs text-slate-400">
          {percentage}%
        </span>
      </div>

      <div className="ml-7 mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barClassName}`}
          style={{
            width: `${Math.min(percentage, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   INVENTORY METRIC
============================================================ */

function InventoryMetric({
  icon: Icon,
  title,
  value,
  description,
  iconClassName,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
  iconClassName: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClassName}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{description}</p>
    </div>
  );
}

/* ============================================================
   INVENTORY HEALTH BAR
============================================================ */

function InventoryHealthBar({
  lowStock,
  totalProducts,
}: {
  lowStock: number;
  totalProducts: number;
}) {
  const healthyProducts = Math.max(totalProducts - lowStock, 0);

  const healthyPercentage =
    totalProducts > 0 ? Math.round((healthyProducts / totalProducts) * 100) : 0;

  const lowStockPercentage =
    totalProducts > 0 ? Math.round((lowStock / totalProducts) * 100) : 0;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Product Stock Health
        </p>

        <p className="text-sm font-semibold text-slate-700">
          {healthyPercentage}% healthy
        </p>
      </div>

      <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="bg-emerald-500 transition-all duration-700"
          style={{
            width: `${healthyPercentage}%`,
          }}
        />

        <div
          className="bg-amber-500 transition-all duration-700"
          style={{
            width: `${lowStockPercentage}%`,
          }}
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-5 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Healthy: {healthyProducts}
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          Low stock: {lowStock}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SALES METRIC
============================================================ */

function SalesMetric({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <Icon className="h-5 w-5 text-slate-500" />

      <p className="mt-4 text-sm font-medium text-slate-500">{title}</p>

      <p className="mt-1 text-3xl font-bold text-slate-950">
        {value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

/* ============================================================
   QUICK ACTION
============================================================ */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 transition group-hover:bg-slate-900 group-hover:text-white">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-900">{title}</p>

        <p className="mt-0.5 truncate text-xs text-slate-500">{description}</p>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600" />
    </button>
  );
}

/* ============================================================
   ERROR
============================================================ */

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

/* ============================================================
   SKELETON
============================================================ */

function DashboardSkeleton() {
  return (
    <PageContainer>
      <div>
        <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />

        <div className="mt-4 h-9 w-80 animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-4 w-96 max-w-full animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-7 h-10 w-64 animate-pulse rounded-xl bg-slate-200" />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

            <div className="mt-4 h-9 w-20 animate-pulse rounded bg-slate-200" />

            <div className="mt-3 h-3 w-40 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />

        <div className="h-72 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      </div>

      <div className="mt-6 h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
    </PageContainer>
  );
}
