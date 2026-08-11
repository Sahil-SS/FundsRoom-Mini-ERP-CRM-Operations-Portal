"use client";

import { ArrowLeft, Edit, MapPin, Package, Tag } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";

import ProductStockBadge from "@/components/products/ProductStockBadge";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { useProduct } from "@/hooks/useProducts";

export default function ProductDetailsPage() {
  const params = useParams();

  const router = useRouter();

  const id = String(params.id);

  const { user } = useAuth();

  const { data: product, isLoading, isError, error, refetch } = useProduct(id);

  const canEdit = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !product) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Unable to load product</h2>

          <p className="mt-1 text-sm text-red-700">{getErrorMessage(error)}</p>

          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>

            <Button variant="ghost" onClick={() => router.push("/products")}>
              Back to Products
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="-ml-3 mb-3 text-slate-600"
          onClick={() => router.push("/products")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Inventory</p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Product Details
              </h2>
            </div>
          </div>

          {canEdit && (
            <Button
              variant="outline"
              onClick={() => router.push(`/products/${id}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                {product.name}
              </h3>

              <p className="mt-2">
                <code className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {product.sku}
                </code>
              </p>
            </div>

            <ProductStockBadge
              currentStock={product.currentStock}
              minimumStock={product.minimumStock}
            />
          </div>

          <div className="grid gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoItem label="Category" value={product.category} icon={Tag} />

            <InfoItem
              label="Unit Price"
              value={formatPrice(product.unitPrice)}
            />

            <InfoItem
              label="Current Stock"
              value={String(product.currentStock)}
            />

            <InfoItem
              label="Minimum Stock"
              value={String(product.minimumStock)}
            />

            <InfoItem
              label="Warehouse Location"
              value={product.warehouseLocation || "—"}
              icon={MapPin}
            />

            <InfoItem label="SKU" value={product.sku} />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-slate-50">
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Inventory Note
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Current stock is controlled through inventory movements. Product
              details define the master record and stock thresholds.
            </p>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function InfoItem({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="flex gap-3">
      {Icon && <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />}

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function ProductDetailsSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />

        <div className="h-80 animate-pulse rounded-xl bg-slate-200" />

        <div className="h-24 animate-pulse rounded-xl bg-slate-200" />
      </div>
    </PageContainer>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
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

    return axiosError.response?.data?.message ?? "Unable to load the product.";
  }

  return "Please check that the backend is running and try again.";
}
