"use client";

import { FileText, Plus, RefreshCw } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import ChallanFilters from "@/components/challans/ChallanFilters";
import ChallanTable from "@/components/challans/ChallanTable";
import Pagination from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";
import { useChallans } from "@/hooks/useChallans";
import { useCustomers } from "@/hooks/useCustomers";

import type { ChallanStatus } from "@/types/challan";

const LIMIT = 10;

export default function ChallansPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [customerId, setCustomerId] = useState<string>("ALL");

  const [status, setStatus] = useState<"ALL" | ChallanStatus>("ALL");

  const [page, setPage] = useState<number>(1);

  const { data: customerData, isLoading: customersLoading } = useCustomers({
    page: 1,
    limit: 100,
  });

  const customers = customerData?.data ?? [];

  const {
    data: challanData,
    isLoading: challansLoading,
    isError: challansError,
    error,
    refetch,
  } = useChallans({
    page,
    limit: LIMIT,
    customerId: customerId === "ALL" ? undefined : customerId,
    status: status === "ALL" ? undefined : status,
  });

  const canCreate = user?.role === "ADMIN" || user?.role === "SALES";

  function handleCustomerChange(value: string) {
    setCustomerId(value);
    setPage(1);
  }

  function handleStatusChange(value: "ALL" | ChallanStatus) {
    setStatus(value);
    setPage(1);
  }

  function handleReset() {
    setCustomerId("ALL");
    setStatus("ALL");
    setPage(1);
  }

  const isLoading = customersLoading || challansLoading;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />

            <p className="text-sm font-medium text-slate-500">Sales</p>
          </div>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Sales Challans
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create, track, and manage customer challans.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {canCreate && (
            <Button type="button" onClick={() => router.push("/challans/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Create Challan
            </Button>
          )}
        </div>
      </div>

      <section className="mt-6">
        <ChallanFilters
          customers={customers}
          customerId={customerId}
          status={status}
          onCustomerChange={handleCustomerChange}
          onStatusChange={handleStatusChange}
          onReset={handleReset}
        />
      </section>

      <section className="mt-4">
        {isLoading ? (
          <TableSkeleton />
        ) : challansError ? (
          <ErrorState
            message={getErrorMessage(error)}
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <ChallanTable challans={challanData?.data ?? []} />

            {challanData?.pagination && (
              <div className="mt-4">
                <Pagination
                  page={challanData.pagination.page}
                  totalPages={challanData.pagination.totalPages}
                  total={challanData.pagination.total}
                  limit={challanData.pagination.limit}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </section>
    </PageContainer>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        {Array.from({ length: 7 }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-4">
            {Array.from({
              length: 6,
            }).map((_, columnIndex) => (
              <div
                key={columnIndex}
                className="h-5 animate-pulse rounded bg-slate-200"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h3 className="font-semibold text-red-900">Unable to load challans</h3>

      <p className="mt-1 text-sm text-red-700">{message}</p>

      <Button
        type="button"
        variant="outline"
        className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
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

    return axiosError.response?.data?.message ?? "Unable to load challans.";
  }

  return "Please check that the backend is running and try again.";
}
