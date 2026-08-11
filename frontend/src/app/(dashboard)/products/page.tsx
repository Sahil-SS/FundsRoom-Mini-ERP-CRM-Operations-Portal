"use client";

import { Package, Plus } from "lucide-react";

import { useEffect, useMemo, useState } from "react";

import PageContainer from "@/components/layout/PageContainer";

import ProductFilters from "@/components/products/ProductFilters";
import ProductTable from "@/components/products/ProductTable";

import Pagination from "@/components/common/Pagination";

import { Button } from "@/components/ui/button";

import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";

const LIMIT = 10;

export default function ProductsPage() {
  const { user } = useAuth();

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("ALL");

  const [stockFilter, setStockFilter] = useState<"ALL" | "LOW">("ALL");

  const [page, setPage] = useState(1);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());

      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError, error, refetch } = useProducts({
    page,
    limit: LIMIT,

    search: debouncedSearch || undefined,

    category: category === "ALL" ? undefined : category,

    lowStock: stockFilter === "LOW" ? true : undefined,
  });

  const categories = useMemo(() => {
    const values = data?.data?.map((product) => product.category) ?? [];

    return Array.from(new Set(values)).sort();
  }, [data?.data]);

  const canCreateProduct = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  function resetFilters() {
    setSearch("");
    setCategory("ALL");
    setStockFilter("ALL");
    setPage(1);
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-600" />

            <p className="text-sm font-medium text-slate-500">Inventory</p>
          </div>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Products
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage product master data, pricing, stock levels, and warehouse
            locations.
          </p>
        </div>

        {canCreateProduct && (
          <Button
            onClick={() => {
              // eslint-disable-next-line @next/next/no-location-assign-relative-destination
              window.location.href = "/products/new";
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="mt-6">
        <ProductFilters
          search={search}
          category={category}
          stockFilter={stockFilter}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStockFilterChange={setStockFilter}
          onReset={resetFilters}
        />
      </div>

      {/* Table */}
      <div className="mt-6">
        {isLoading ? (
          <ProductTableSkeleton />
        ) : isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h3 className="font-semibold text-red-900">
              Unable to load products
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
            <ProductTable products={data?.data ?? []} />

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

function ProductTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        {Array.from({
          length: 7,
        }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-4">
            {Array.from({
              length: 6,
            }).map((_, column) => (
              <div
                key={column}
                className="h-5 animate-pulse rounded bg-slate-200"
              />
            ))}
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
