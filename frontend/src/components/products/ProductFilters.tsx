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

interface ProductFiltersProps {
  search: string;
  category: string;
  stockFilter: "ALL" | "LOW";
  categories: string[];

  onSearchChange: (value: string) => void;

  onCategoryChange: (value: string) => void;

  onStockFilterChange: (value: "ALL" | "LOW") => void;

  onReset: () => void;
}

export default function ProductFilters({
  search,
  category,
  stockFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStockFilterChange,
  onReset,
}: ProductFiltersProps) {
  const hasFilters =
    search.trim() !== "" || category !== "ALL" || stockFilter !== "ALL";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search product name or SKU..."
            className="pl-9"
          />
        </div>

        <Select
          value={category}
          onValueChange={(value) => onCategoryChange(value ?? "ALL")}
        >
          <SelectTrigger className="w-full lg:w-52">
            <SelectValue placeholder="Category" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>

            {categories.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stockFilter}
          onValueChange={(value) => onStockFilterChange(value as "ALL" | "LOW")}
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All stock</SelectItem>

            <SelectItem value="LOW">Low stock only</SelectItem>
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
