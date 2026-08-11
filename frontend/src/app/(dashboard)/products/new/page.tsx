"use client";

import { ArrowLeft, PackagePlus } from "lucide-react";

import { useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";

import ProductForm from "@/components/products/ProductForm";

import { useAuth } from "@/hooks/useAuth";

import { useCreateProduct } from "@/hooks/useProducts";

import type { ProductFormValues } from "@/schemas/product.schema";

import { Button } from "@/components/ui/button";

export default function NewProductPage() {
  const router = useRouter();

  const { user } = useAuth();

  const createProduct = useCreateProduct();

  const canCreate = user?.role === "ADMIN" || user?.role === "WAREHOUSE";

  if (!canCreate) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Access denied</h2>

          <p className="mt-1 text-sm text-red-700">
            You do not have permission to create products.
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/products")}
          >
            Back to Products
          </Button>
        </div>
      </PageContainer>
    );
  }

  function handleSubmit(values: ProductFormValues) {
    createProduct.mutate(values, {
      onSuccess: (product) => {
        router.push(`/products/${product.id}`);
      },
    });
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

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <PackagePlus className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Inventory</p>

            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Add Product
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new product in the master catalog.
            </p>
          </div>
        </div>
      </div>

      <ProductForm
        mode="create"
        isSubmitting={createProduct.isPending}
        serverError={
          createProduct.error ? getErrorMessage(createProduct.error) : undefined
        }
        onSubmit={handleSubmit}
        onCancel={() => router.push("/products")}
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

    return (
      axiosError.response?.data?.message ?? "Unable to create the product."
    );
  }

  return "Please check that the backend is running and try again.";
}
