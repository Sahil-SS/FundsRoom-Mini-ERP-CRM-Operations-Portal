"use client";

import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import PageContainer from "@/components/layout/PageContainer";
import CustomerFilters from "@/components/customers/CustomerFilters";
import CustomerTable from "@/components/customers/CustomerTable";
import Pagination from "@/components/common/Pagination";

import { Button } from "@/components/ui/button";

import { useCustomers } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";

import type { CustomerStatus, CustomerType } from "@/types/customer";

const LIMIT = 10;

export default function CustomersPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "ALL">("ALL");
  const [type, setType] = useState<CustomerType | "ALL">("ALL");
  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [status, type]);

  const { data, isLoading, isError, error, refetch } = useCustomers({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
    status: status === "ALL" ? undefined : status,
    type: type === "ALL" ? undefined : type,
  });

  const canManageCustomers = user?.role === "ADMIN" || user?.role === "SALES";

  function resetFilters() {
    setSearch("");
    setStatus("ALL");
    setType("ALL");
    setPage(1);
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-slate-600" />

            <p className="text-sm font-medium text-slate-500">CRM</p>
          </div>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Customers
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage customers, leads, and business contacts.
          </p>
        </div>

        {canManageCustomers && (
          <Link href="/customers/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </Link>
        )}
      </div>

      <div className="mt-6">
        <CustomerFilters
          search={search}
          status={status}
          type={type}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onTypeChange={setType}
          onReset={resetFilters}
        />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <CustomerTableSkeleton />
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">
              Unable to load customers
            </h3>

            <p className="mt-1 text-sm text-red-700">
              {getErrorMessage(error)}
            </p>

            <Button
              variant="outline"
              className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
              onClick={() => refetch()}
            >
              Try again
            </Button>
          </div>
        ) : (
          <>
            <CustomerTable customers={data?.data ?? []} />

            {data?.pagination && (
              <div className="mt-4">
                <Pagination
                  page={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  total={data.pagination.total}
                  limit={data.pagination.limit}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}

function CustomerTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="grid grid-cols-5 gap-4">
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 animate-pulse rounded bg-slate-200" />
          </div>
        ))}
      </div>
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

    return (
      axiosError.response?.data?.message ??
      "The server returned an unexpected error."
    );
  }

  return "Please check that the backend is running.";
}
