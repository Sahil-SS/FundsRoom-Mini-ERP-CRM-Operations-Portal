"use client";

import { ArrowLeft, FileText } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";

import ChallanActions from "@/components/challans/ChallanActions";
import ChallanDetails from "@/components/challans/ChallanDetails";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";


import {
  useCancelChallan,
  useChallan,
  useConfirmChallan,
} from "@/hooks/useChallans";

export default function ChallanDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const { user } = useAuth();

  const { data: challan, isLoading, isError, error, refetch } = useChallan(id);

  const confirmChallan = useConfirmChallan();

  const cancelChallan = useCancelChallan();

  const canManage = user?.role === "ADMIN" || user?.role === "SALES";

  function handleConfirm() {
    if (!challan) {
      return;
    }

    const confirmed = window.confirm(
      `Confirm ${challan.challanNumber}? This will deduct stock and create OUT inventory movements.`,
    );

    if (!confirmed) {
      return;
    }

    confirmChallan.mutate(challan.id);
  }

  function handleCancel() {
    if (!challan) {
      return;
    }

    const message =
      challan.status === "CONFIRMED"
        ? `Cancel ${challan.challanNumber}? This will restore the dispatched stock and create IN inventory movements.`
        : `Cancel ${challan.challanNumber}?`;

    const confirmed = window.confirm(message);

    if (!confirmed) {
      return;
    }

    cancelChallan.mutate(challan.id);
  }

  if (isLoading) {
    return (
      <PageContainer>
        <DetailsSkeleton />
      </PageContainer>
    );
  }

  if (isError || !challan) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h2 className="font-semibold text-red-900">Unable to load challan</h2>

          <p className="mt-1 text-sm text-red-700">{getErrorMessage(error)}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => refetch()}>
              Try again
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/challans")}
            >
              Back to Challans
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Header */}

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

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
              <FileText className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">Sales</p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                {challan.challanNumber}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {challan.customer?.name ?? "Customer"}
              </p>
            </div>
          </div>

          <ChallanActions
            status={challan.status}
            canManage={canManage}
            isConfirming={confirmChallan.isPending}
            isCancelling={cancelChallan.isPending}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </div>
      </div>

      {/* Mutation error */}

      {(confirmChallan.isError || cancelChallan.isError) && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">
            {getErrorMessage(confirmChallan.error ?? cancelChallan.error)}
          </p>

          {confirmChallan.isError && (
            <p className="mt-1 text-xs text-red-700">
              If this challan is being confirmed, verify that every product has
              sufficient stock. A failed confirmation leaves the challan in
              DRAFT.
            </p>
          )}
        </div>
      )}

      <ChallanDetails challan={challan} />
    </PageContainer>
  );
}

function DetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-8 w-48 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="h-52 animate-pulse rounded-xl bg-white" />

      <div className="h-96 animate-pulse rounded-xl bg-white" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-24 animate-pulse rounded-xl bg-white" />
        <div className="h-24 animate-pulse rounded-xl bg-white" />
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
      "Unable to complete the challan operation."
    );
  }

  return "Please check that the backend is running and try again.";
}
