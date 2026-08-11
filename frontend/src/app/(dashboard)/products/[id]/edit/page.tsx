"use client";

import { ArrowLeft, Edit } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";

import ProductForm from "@/components/products/ProductForm";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { useProduct, useUpdateProduct } from "@/hooks/useProducts";

import type { ProductFormValues } from "@/schemas/product.schema";

export default function EditProductPage() {
  const params = useParams();

  const router = useRouter();

  const id = String(params.id);

  const { user } = useAuth();

  const { data: product, isLoading, isError, error, refetch } = useProduct(id);

  const updateProduct = useUpdateProduct();

  const canEdit = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  if (!canEdit) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Access denied</h2>

          <p className="mt-1 text-sm text-red-700">
            You do not have permission to edit products.
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push(`/products/${id}`)}
          >
            Back to Product
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-6">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />

          <div className="h-125 animate-pulse rounded-xl bg-slate-200" />
        </div>
      </PageContainer>
    );
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

  function handleSubmit(values: ProductFormValues) {
    updateProduct.mutate(
      {
        id,
        payload: values,
      },
      {
        onSuccess: () => {
          router.push(`/products/${id}`);
        },
      },
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="-ml-3 mb-3 text-slate-600"
          onClick={() => router.push(`/products/${id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Product
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Edit className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Inventory</p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Edit Product
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update the product master information.
            </p>
          </div>
        </div>
      </div>

      <ProductForm
        mode="edit"
        initialData={product}
        isSubmitting={updateProduct.isPending}
        serverError={
          updateProduct.error ? getErrorMessage(updateProduct.error) : undefined
        }
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/products/${id}`)}
      />
    </PageContainer>
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
        "A product with this SKU already exists."
      );
    }

    return axiosError.response?.data?.message ?? "Unable to save the product.";
  }

  return "Please check that the backend is running and try again.";
}
