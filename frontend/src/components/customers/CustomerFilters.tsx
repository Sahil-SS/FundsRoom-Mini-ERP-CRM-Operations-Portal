"use client";

import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CustomerStatus, CustomerType } from "@/types/customer";

interface CustomerFiltersProps {
  search: string;
  status: CustomerStatus | "ALL";
  type: CustomerType | "ALL";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: CustomerStatus | "ALL") => void;
  onTypeChange: (value: CustomerType | "ALL") => void;
  onReset: () => void;
}

export default function CustomerFilters({
  search,
  status,
  type,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onReset,
}: CustomerFiltersProps) {
  const hasFilters = search.trim() !== "" || status !== "ALL" || type !== "ALL";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search name, mobile, email or business..."
            className="pl-9"
          />
        </div>

        <Select
          value={status}
          onValueChange={(value) =>
            onStatusChange(value as CustomerStatus | "ALL")
          }
        >
          <SelectTrigger className="w-full lg:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>

            <SelectItem value="LEAD">Lead</SelectItem>

            <SelectItem value="ACTIVE">Active</SelectItem>

            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={type}
          onValueChange={(value) => onTypeChange(value as CustomerType | "ALL")}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Customer type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All types</SelectItem>

            <SelectItem value="RETAIL">Retail</SelectItem>

            <SelectItem value="WHOLESALE">Wholesale</SelectItem>

            <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="shrink-0"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
