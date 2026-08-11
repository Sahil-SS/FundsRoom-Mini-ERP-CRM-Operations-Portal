"use client";

import { ArrowLeft, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";
import CustomerForm from "@/components/customers/CustomerForm";

import { Button } from "@/components/ui/button";

import { useCreateCustomer } from "@/hooks/useCustomers";

import { useAuth } from "@/hooks/useAuth";

import type { CustomerFormValues } from "@/schemas/customer.schema";

export default function NewCustomerPage() {
  const router = useRouter();

  const { user } = useAuth();
  const createCustomer = useCreateCustomer();

  const canCreate = user?.role === "ADMIN" || user?.role === "SALES";

  if (!canCreate) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Access denied</h2>

          <p className="mt-1 text-sm text-red-700">
            You do not have permission to create customers.
          </p>

          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/customers")}
          >
            Back to Customers
          </Button>
        </div>
      </PageContainer>
    );
  }

  function handleSubmit(values: CustomerFormValues) {
    createCustomer.mutate(values, {
      onSuccess: (customer) => {
        router.push(`/customers/${customer.id}`);
      },
    });
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <Button
          variant="ghost"
          className="-ml-3 mb-3 text-slate-600"
          onClick={() => router.push("/customers")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <UserPlus className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">
              Add Customer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new customer record.
            </p>
          </div>
        </div>
      </div>

      <CustomerForm
        mode="create"
        isSubmitting={createCustomer.isPending}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/customers")}
        serverError={
          createCustomer.error
            ? getErrorMessage(createCustomer.error)
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

    return axiosError.response?.data?.message ?? "Unable to create customer.";
  }

  return "Unable to create customer. Please try again.";
}
