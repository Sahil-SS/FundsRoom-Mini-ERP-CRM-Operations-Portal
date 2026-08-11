"use client";

import {
  ArrowLeft,
  CalendarPlus,
  Pencil,
  UserRound,
} from "lucide-react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { useState } from "react";

import PageContainer from "@/components/layout/PageContainer";

import CustomerDetails from "@/components/customers/CustomerDetails";
import FollowUpTimeline from "@/components/customers/FollowUpTimeline";
import FollowUpForm from "@/components/customers/FollowUpForm";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";

import {
  useCustomer,
  useCustomerFollowUps,
  useCreateFollowUp,
} from "@/hooks/useCustomers";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const { user } = useAuth();

  const [showFollowUpForm, setShowFollowUpForm] =
    useState(false);

  const {
    data: customer,
    isLoading: customerLoading,
    isError: customerError,
    error,
    refetch,
  } = useCustomer(id);

  const {
    data: followUps = [],
    isLoading: followUpsLoading,
    isError: followUpsError,
  } = useCustomerFollowUps(id);

  const createFollowUp =
    useCreateFollowUp();

  const canEdit =
    user?.role === "ADMIN" ||
    user?.role === "SALES";

  if (customerLoading) {
    return <DetailsSkeleton />;
  }

  if (customerError || !customer) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">
            Unable to load customer
          </h2>

          <p className="mt-1 text-sm text-red-700">
            {getErrorMessage(error)}
          </p>

          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              onClick={() => refetch()}
            >
              Try again
            </Button>

            <Button
              variant="ghost"
              onClick={() =>
                router.push("/customers")
              }
            >
              Back to Customers
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  function handleFollowUpSubmit(values: {
    note: string;
    followUpDate: string;
  }) {
    createFollowUp.mutate(
      {
        id,
        payload: values,
      },
      {
        onSuccess: () => {
          setShowFollowUpForm(false);
        },
      }
    );
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          className="-ml-3 mb-3 text-slate-600"
          onClick={() =>
            router.push("/customers")
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Customers
        </Button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
              <UserRound className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                CRM
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                Customer Details
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {canEdit && (
              <Button
                variant="outline"
                onClick={() =>
                  router.push(
                    `/customers/${id}/edit`
                  )
                }
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Customer
              </Button>
            )}

            {canEdit && (
              <Button
                onClick={() =>
                  setShowFollowUpForm(
                    (current) => !current
                  )
                }
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                Add Follow-up
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Customer information */}
      <CustomerDetails
        customer={customer}
      />

      {/* Follow-up form */}
      {showFollowUpForm && (
        <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="font-semibold text-slate-900">
              Add Follow-up
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Record the next action for this
              customer.
            </p>
          </div>

          <div className="p-5">
            <FollowUpForm
              isSubmitting={
                createFollowUp.isPending
              }
              onSubmit={
                handleFollowUpSubmit
              }
              onCancel={() =>
                setShowFollowUpForm(false)
              }
              serverError={
                createFollowUp.error
                  ? getErrorMessage(
                      createFollowUp.error
                    )
                  : undefined
              }
            />
          </div>
        </section>
      )}

      {/* Follow-up history */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">
            Follow-up History
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            CRM activity recorded for this
            customer.
          </p>
        </div>

        <div className="p-5">
          {followUpsError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">
                Unable to load follow-ups.
              </p>
            </div>
          ) : (
            <FollowUpTimeline
              followUps={followUps}
              isLoading={
                followUpsLoading
              }
            />
          )}
        </div>
      </section>

      {/* Related challans */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">
            Related Challans
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Sales challans associated with this
            customer.
          </p>
        </div>

        <div className="p-5">
          <p className="text-sm text-slate-500">
            Challan information will become
            available when the Challan module is
            implemented.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}

function DetailsSkeleton() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 h-8 w-56 animate-pulse rounded bg-slate-200" />
        </div>

        <div className="h-80 animate-pulse rounded-xl bg-white" />

        <div className="h-64 animate-pulse rounded-xl bg-white" />

        <div className="h-48 animate-pulse rounded-xl bg-white" />
      </div>
    </PageContainer>
  );
}

function getErrorMessage(
  error: unknown
): string {
  if (
    error &&
    typeof error === "object" &&
    "response" in error
  ) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return (
      axiosError.response?.data?.message ??
      "Unable to load the customer."
    );
  }

  return "Please check that the backend is running and try again.";
}

