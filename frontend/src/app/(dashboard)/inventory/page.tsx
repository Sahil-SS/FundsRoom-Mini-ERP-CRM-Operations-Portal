"use client";

import { ArrowDownUp, RefreshCw, Warehouse } from "lucide-react";

import { useEffect, useState } from "react";

import PageContainer from "@/components/layout/PageContainer";

import CurrentInventoryTable from "@/components/inventory/CurrentInventoryTable";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import MovementTable from "@/components/inventory/MovementTable";

import Pagination from "@/components/common/Pagination";

import { Button } from "@/components/ui/button";

import { useInventory } from "@/hooks/useInventory";

import { useProducts } from "@/hooks/useProducts";

import type { MovementType } from "@/types/inventory";

const LIMIT = 10;

export default function InventoryPage() {
  const [productId, setProductId] = useState("ALL");

  const [type, setType] = useState<"ALL" | MovementType>("ALL");

  const [page, setPage] = useState(1);

  /*
   * Product list
   *
   * The Products API supports pagination.
   * We fetch the first 100 products so that
   * the inventory page can display the current
   * inventory and populate the product filter.
   */
  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
    error: productError,
    refetch: refetchProducts,
  } = useProducts({
    page: 1,
    limit: 100,
  });

  const products = productData?.data ?? [];

  /*
   * Inventory movements
   *
   * IMPORTANT:
   * The backend accepts:
   *
   * page
   * limit
   * productId
   * type
   *
   * It does NOT accept a search parameter.
   */
  const {
    data: movementData,
    isLoading: movementsLoading,
    isError: movementsError,
    error: movementError,
    refetch: refetchMovements,
  } = useInventory({
    page,
    limit: LIMIT,

    productId: productId === "ALL" ? undefined : productId,

    type: type === "ALL" ? undefined : type,
  });

  /*
   * Reset pagination whenever a filter changes.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [productId, type]);

  function resetFilters() {
    setProductId("ALL");
    setType("ALL");
    setPage(1);
  }

  function handleRefresh() {
    refetchProducts();
    refetchMovements();
  }

  const isLoading = productsLoading || movementsLoading;

  return (
    <PageContainer>
      {/* -------------------------------------------------- */}
      {/* PAGE HEADER */}
      {/* -------------------------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-slate-600" />

            <p className="text-sm font-medium text-slate-500">Operations</p>
          </div>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
            Inventory
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Monitor current stock and track inventory movements.
          </p>
        </div>

        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* -------------------------------------------------- */}
      {/* CURRENT INVENTORY */}
      {/* -------------------------------------------------- */}

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <Warehouse className="h-4 w-4 text-slate-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Current Inventory</h3>

            <p className="text-sm text-slate-500">
              Current stock levels across products.
            </p>
          </div>
        </div>

        {productsLoading ? (
          <TableSkeleton />
        ) : productsError ? (
          <ErrorState
            title="Unable to load current inventory"
            message={getErrorMessage(productError)}
            onRetry={refetchProducts}
          />
        ) : (
          <CurrentInventoryTable products={products} />
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* MOVEMENT HISTORY */}
      {/* -------------------------------------------------- */}

      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <ArrowDownUp className="h-4 w-4 text-slate-600" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Movement History</h3>

            <p className="text-sm text-slate-500">
              Track every stock IN and OUT movement.
            </p>
          </div>
        </div>

        {/* Filters */}

        <InventoryFilters
          products={products}
          productId={productId}
          type={type}
          onProductChange={setProductId}
          onTypeChange={setType}
          onReset={resetFilters}
        />

        {/* Movement table */}

        <div className="mt-4">
          {movementsLoading ? (
            <TableSkeleton />
          ) : movementsError ? (
            <ErrorState
              title="Unable to load movement history"
              message={getErrorMessage(movementError)}
              onRetry={refetchMovements}
            />
          ) : (
            <>
              <MovementTable movements={movementData?.data ?? []} />

              {movementData?.pagination && (
                <div className="mt-4">
                  <Pagination
                    page={movementData.pagination.page}
                    totalPages={movementData.pagination.totalPages}
                    total={movementData.pagination.total}
                    limit={movementData.pagination.limit}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageContainer>
  );
}

/* ====================================================== */
/* LOADING STATE */
/* ====================================================== */

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-4 p-5">
        {Array.from({
          length: 6,
        }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4">
            {Array.from({
              length: 4,
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

/* ====================================================== */
/* ERROR STATE */
/* ====================================================== */

function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h3 className="font-semibold text-red-900">{title}</h3>

      <p className="mt-1 text-sm text-red-700">{message}</p>

      <Button
        variant="outline"
        className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
}

/* ====================================================== */
/* ERROR MESSAGE */
/* ====================================================== */

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        status?: number;
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
