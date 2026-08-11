"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { ChallanStatus } from "@/types/challan";

interface ChallanActionsProps {
  status: ChallanStatus;

  canManage: boolean;

  isConfirming: boolean;

  isCancelling: boolean;

  onConfirm: () => void;

  onCancel: () => void;
}

export default function ChallanActions({
  status,
  canManage,
  isConfirming,
  isCancelling,
  onConfirm,
  onCancel,
}: ChallanActionsProps) {
  if (!canManage || status === "CANCELLED") {
    return null;
  }

  const isBusy = isConfirming || isCancelling;

  return (
    <div className="flex flex-wrap gap-2">
      {status === "DRAFT" && (
        <Button type="button" onClick={onConfirm} disabled={isBusy}>
          {isConfirming ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}

          {isConfirming ? "Confirming..." : "Confirm Challan"}
        </Button>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isBusy}
      >
        {isCancelling ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <XCircle className="mr-2 h-4 w-4" />
        )}

        {isCancelling ? "Cancelling..." : "Cancel Challan"}
      </Button>
    </div>
  );
}
