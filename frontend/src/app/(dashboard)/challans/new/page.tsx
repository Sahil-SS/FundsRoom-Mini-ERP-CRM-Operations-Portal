"use client";

import { ArrowLeft, FilePlus2 } from "lucide-react";

import { useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";

import ChallanForm from "@/components/challans/ChallanForm";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { useCustomers } from "@/hooks/useCustomers";

import { useProducts } from "@/hooks/useProducts";

import { useCreateChallan } from "@/hooks/useChallans";

import type { CreateChallanFormValues } from "@/schemas/challan.schema";

export default function NewChallanPage() {
  const router = useRouter();

  const { user } = useAuth();

  const {
    data: customerData,
    isLoading: customersLoading,
    isError: customersError,
    error: customerError,
  } = useCustomers({
    page: 1,
    limit: 100,
  });

  const {
    data: productData,
    isLoading: productsLoading,
    isError: productsError,
    error: productError,
  } = useProducts({
    page: 1,
    limit: 100,
  });

  const createChallan = useCreateChallan();

  const customers = customerData?.data ?? [];

  const products = productData?.data ?? [];

  const canCreate = user?.role === "ADMIN" || user?.role === "SALES";

  function handleSubmit(values: CreateChallanFormValues) {
    createChallan.mutate(values, {
      onSuccess: (challan) => {
        router.push(`/challans/${challan.id}`);
      },
    });
  }

  if (!canCreate) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Access denied</h2>

          <p className="mt-1 text-sm text-red-700">
            You do not have permission to create challans.
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/challans")}
          >
            Back to Challans
          </Button>
        </div>
      </PageContainer>
    );
  }

  if (customersLoading || productsLoading) {
    return (
      <PageContainer>
        <PageSkeleton />
      </PageContainer>
    );
  }

  if (customersError || productsError) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Unable to prepare challan form
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {getErrorMessage(customerError ?? productError)}
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/challans")}
          >
            Back to Challans
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 mb-3 text-slate-600"
          onClick={() => router.push("/challans")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challans
        </Button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
            <FilePlus2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Sales</p>

            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Create Challan
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create a draft delivery challan for a customer.
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Challan Details</h2>

          <p className="mt-1 text-sm text-slate-500">
            Select a customer and add the products being dispatched.
          </p>
        </div>

        <div className="p-5">
          <ChallanForm
            customers={customers}
            products={products}
            isSubmitting={createChallan.isPending}
            serverError={
              createChallan.error
                ? getErrorMessage(createChallan.error)
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => router.push("/challans")}
          />
        </div>
      </section>
    </PageContainer>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-56 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="space-y-6">
          <div className="h-10 animate-pulse rounded bg-slate-200" />
          <div className="h-32 animate-pulse rounded bg-slate-200" />
          <div className="h-20 animate-pulse rounded bg-slate-200" />
        </div>
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
      axiosError.response?.data?.message ?? "Unable to load the required data."
    );
  }

  return "Please check that the backend is running and try again.";
}
