"use client";

import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import CustomerForm from "@/components/customers/CustomerForm";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import { useCustomer, useUpdateCustomer } from "@/hooks/useCustomers";

import type { CustomerFormValues } from "@/schemas/customer.schema";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const { user } = useAuth();

  const { data: customer, isLoading, isError, error } = useCustomer(id);

  const updateCustomer = useUpdateCustomer();

  const canUpdate = user?.role === "ADMIN" || user?.role === "SALES";

  if (!canUpdate) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Access denied</h2>

          <p className="mt-1 text-sm text-red-700">
            You do not have permission to edit customers.
          </p>

          <Link href="/customers">
            <Button variant="outline" className="mt-4">
              Back to Customers
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-4">
          <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-80 animate-pulse rounded bg-slate-200" />
          <div className="h-125 animate-pulse rounded-xl bg-white" />
        </div>
      </PageContainer>
    );
  }

  if (isError || !customer) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Unable to load customer
          </h2>

          <p className="mt-1 text-sm text-red-700">{getErrorMessage(error)}</p>

          <Link href="/customers">
            <Button variant="outline" className="mt-4">
              Back to Customers
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  function handleSubmit(values: CustomerFormValues) {
    updateCustomer.mutate(
      {
        id,
        payload: values,
      },
      {
        onSuccess: () => {
          router.push(`/customers/${id}`);
        },
      },
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Link href={`/customers/${id}`}>
          <Button variant="ghost" className="-ml-3 mb-3 text-slate-600">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customer
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <Pencil className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Edit Customer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update {customer.name}&apos;s customer record.
            </p>
          </div>
        </div>
      </div>

      <CustomerForm
        mode="edit"
        customer={customer}
        isSubmitting={updateCustomer.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.push(`/customers/${id}`)}
        serverError={
          updateCustomer.error
            ? getErrorMessage(updateCustomer.error)
            : undefined
        }
      />
    </PageContainer>
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

    return axiosError.response?.data?.message ?? "Unable to load customer.";
  }

  return "Unable to load customer. Please try again.";
}
