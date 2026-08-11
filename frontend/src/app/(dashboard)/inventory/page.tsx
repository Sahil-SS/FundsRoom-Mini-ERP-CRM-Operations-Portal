"use client";

import { ArrowDownUp, Plus, RefreshCw, Warehouse } from "lucide-react";

import { useState } from "react";

import PageContainer from "@/components/layout/PageContainer";

import CurrentInventoryTable from "@/components/inventory/CurrentInventoryTable";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import MovementTable from "@/components/inventory/MovementTable";
import StockMovementForm from "@/components/inventory/StockMovementForm";

import Pagination from "@/components/common/Pagination";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { useInventory, useCreateStockMovement } from "@/hooks/useInventory";

import { useProducts } from "@/hooks/useProducts";

import type { MovementType } from "@/types/inventory";

import type { StockMovementFormValues } from "@/schemas/inventory.schema";

const LIMIT = 10;

export default function InventoryPage() {
  const { user } = useAuth();

  const [productId, setProductId] = useState("ALL");

  const [type, setType] = useState<"ALL" | MovementType>("ALL");

  const [page, setPage] = useState(1);

  const [showMovementForm, setShowMovementForm] = useState(false);

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

  const createMovement = useCreateStockMovement();

  const canManageInventory =
    user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  //   function handleProductChange(value: string) {
  //     setProductId(value);
  //     setPage(1);
  //   }

  //   function handleTypeChange(value: "ALL" | MovementType) {
  //     setType(value);
  //     setPage(1);
  //   }

  function resetFilters() {
    setProductId("ALL");
    setType("ALL");
    setPage(1);
  }

  function handleRefresh() {
    refetchProducts();
    refetchMovements();
  }

  function handleMovementSubmit(values: StockMovementFormValues) {
    createMovement.mutate(values, {
      onSuccess: () => {
        setShowMovementForm(false);

        refetchProducts();
        refetchMovements();
      },
    });
  }

  const isLoading = productsLoading || movementsLoading;

  return (
    <PageContainer>
      {/* PAGE HEADER */}

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

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          {canManageInventory && (
            <Button onClick={() => setShowMovementForm((current) => !current)}>
              <Plus className="mr-2 h-4 w-4" />
              Stock Movement
            </Button>
          )}
        </div>
      </div>

      {/* STOCK MOVEMENT FORM */}

      {showMovementForm && canManageInventory && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="font-semibold text-slate-900">
              Record Stock Movement
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Record stock entering or leaving the warehouse.
            </p>
          </div>

          <div className="p-5">
            <StockMovementForm
              products={products}
              isSubmitting={createMovement.isPending}
              serverError={
                createMovement.error
                  ? getErrorMessage(createMovement.error)
                  : undefined
              }
              onSubmit={handleMovementSubmit}
              onCancel={() => setShowMovementForm(false)}
            />
          </div>
        </section>
      )}

      {/* CURRENT INVENTORY */}

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

      {/* MOVEMENT HISTORY */}

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

        <InventoryFilters
          products={products}
          productId={productId}
          type={type}
          onProductChange={setProductId}
          onTypeChange={setType}
          onReset={resetFilters}
        />

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

    if (axiosError.response?.status === 409) {
      return (
        axiosError.response.data?.message ??
        "Insufficient stock for this movement."
      );
    }

    if (axiosError.response?.status === 403) {
      return (
        axiosError.response.data?.message ??
        "You do not have permission to record stock movements."
      );
    }

    if (axiosError.response?.status === 404) {
      return (
        axiosError.response.data?.message ??
        "The selected product could not be found."
      );
    }

    return (
      axiosError.response?.data?.message ??
      "Unable to record the stock movement."
    );
  }

  return "Please check that the backend is running and try again.";
}
