"use client";

import { ArrowLeft, Download, FileText } from "lucide-react";

import { useParams, useRouter } from "next/navigation";

import PageContainer from "@/components/layout/PageContainer";

import InvoiceDetails from "@/components/invoices/InvoiceDetails";

import { Button } from "@/components/ui/button";

import { useChallan } from "@/hooks/useChallans";

import { downloadInvoicePdf } from "@/lib/pdf/invoicePdf";

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();

  const challanId = String(params.challanId);

  const {
    data: challan,
    isLoading,
    isError,
    error,
    refetch,
  } = useChallan(challanId);

  /*
   * ============================================================
   * LOADING STATE
   * ============================================================
   */

  if (isLoading) {
    return (
      <PageContainer>
        <InvoiceSkeleton />
      </PageContainer>
    );
  }

  /*
   * ============================================================
   * ERROR STATE
   * ============================================================
   */

  if (isError || !challan) {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100">
              <FileText className="h-5 w-5 text-red-700" />
            </div>

            <div>
              <h2 className="font-semibold text-red-900">
                Unable to load invoice
              </h2>

              <p className="mt-1 text-sm text-red-700">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
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

  /*
   * ============================================================
   * INVOICE VALIDATION
   * ============================================================
   *
   * Only CONFIRMED challans can produce invoices.
   */

  if (challan.status !== "CONFIRMED") {
    return (
      <PageContainer>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
              <FileText className="h-5 w-5 text-amber-700" />
            </div>

            <div>
              <h2 className="font-semibold text-amber-900">
                Invoice unavailable
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-amber-700">
                An invoice can only be generated from a confirmed challan. This
                challan is currently{" "}
                <span className="font-semibold">{challan.status}</span>.
              </p>

              <div className="mt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/challans/${challan.id}`)}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Open Challan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  /*
   * ============================================================
   * INVOICE PAGE
   * ============================================================
   */

  return (
    <PageContainer>
      {/* ========================================================
          PAGE HEADER
      ========================================================= */}

      <div className="mb-6">
        <Button
          type="button"
          variant="ghost"
          className="-ml-3 mb-3 text-slate-600"
          onClick={() => router.push(`/challans/${challan.id}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challan
        </Button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          {/* Invoice title */}

          <div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-500" />

              <p className="text-sm font-medium text-slate-500">
                Accounts / Billing
              </p>
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Tax Invoice
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Billing document generated from confirmed challan{" "}
              <span className="font-semibold text-slate-700">
                {challan.challanNumber}
              </span>
              .
            </p>
          </div>

          {/* ====================================================
              INVOICE ACTIONS
          ==================================================== */}

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/challans/${challan.id}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              View Challan
            </Button>

            <Button
              type="button"
              className="bg-slate-950 text-white shadow-sm hover:bg-slate-800"
              onClick={() => downloadInvoicePdf(challan)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Invoice PDF
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================
          INVOICE DOCUMENT
      ========================================================= */}

      <InvoiceDetails challan={challan} />

      {/* ========================================================
          EXPLICIT DOWNLOAD SECTION
      ========================================================= */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Download className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-950">
                Download Tax Invoice
              </p>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Download the complete tax invoice as a PDF document for your
                business records.
              </p>
            </div>
          </div>

          <Button
            type="button"
            size="lg"
            className="shrink-0 bg-slate-950 text-white shadow-sm hover:bg-slate-800"
            onClick={() => downloadInvoicePdf(challan)}
          >
            <Download className="mr-2 h-5 w-5" />
            Download Invoice PDF
          </Button>
        </div>
      </div>

      {/* ========================================================
          REFERENCE INFORMATION
      ========================================================= */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <ReferenceCard
          label="Reference Challan"
          value={challan.challanNumber}
        />

        <ReferenceCard label="Invoice Status" value={challan.status} />

        <ReferenceCard
          label="Created By"
          value={challan.createdBy?.name ?? "—"}
        />
      </div>
    </PageContainer>
  );
}

/*
 * ================================================================
 * REFERENCE CARD
 * ================================================================
 */

function ReferenceCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold text-slate-950">{value}</p>
    </div>
  );
}

/*
 * ================================================================
 * LOADING SKELETON
 * ================================================================
 */

function InvoiceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}

      <div>
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-9 w-56 animate-pulse rounded bg-slate-200" />

        <div className="mt-2 h-4 w-80 max-w-full animate-pulse rounded bg-slate-200" />
      </div>

      {/* Invoice document */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* Invoice header */}

        <div className="h-32 animate-pulse bg-slate-100" />

        {/* Meta */}

        <div className="grid gap-px bg-slate-200 sm:grid-cols-2">
          <div className="h-24 animate-pulse bg-white" />

          <div className="h-24 animate-pulse bg-white" />
        </div>

        {/* Bill From / Bill To */}

        <div className="grid gap-px bg-slate-200 lg:grid-cols-2">
          <div className="h-36 animate-pulse bg-white" />

          <div className="h-36 animate-pulse bg-white" />
        </div>

        {/* Items */}

        <div className="h-80 animate-pulse bg-white" />

        {/* Summary */}

        <div className="h-32 animate-pulse bg-slate-50" />
      </div>

      {/* Download section */}

      <div className="h-24 animate-pulse rounded-2xl bg-white" />
    </div>
  );
}

/*
 * ================================================================
 * ERROR HANDLING
 * ================================================================
 */

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
    };

    return axiosError.response?.data?.message ?? "Unable to load the invoice.";
  }

  return "Please check that the backend is running and try again.";
}
