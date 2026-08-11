"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { ChallanStatus } from "@/types/challan";

import type { Customer } from "@/types/customer";

interface ChallanFiltersProps {
  customers: Customer[];

  customerId: string;

  status: "ALL" | ChallanStatus;

  onCustomerChange: (value: string) => void;

  onStatusChange: (value: "ALL" | ChallanStatus) => void;

  onReset: () => void;
}

export default function ChallanFilters({
  customers,
  customerId,
  status,
  onCustomerChange,
  onStatusChange,
  onReset,
}: ChallanFiltersProps) {
  const hasFilters = customerId !== "ALL" || status !== "ALL";

  const handleCustomerChange = (value: string | null) => {
    if (value !== null) {
      onCustomerChange(value);
    }
  };

  const handleStatusChange = (value: string | null) => {
    if (value !== null) {
      onStatusChange(value as "ALL" | ChallanStatus);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={customerId} onValueChange={handleCustomerChange}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Customer" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Customers</SelectItem>

            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>

            <SelectItem value="DRAFT">Draft</SelectItem>

            <SelectItem value="CONFIRMED">Confirmed</SelectItem>

            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button type="button" variant="outline" onClick={onReset}>
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
