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

import type { MovementType } from "@/types/inventory";

import type { Product } from "@/types/product";

interface InventoryFiltersProps {
  products: Product[];

  productId: string;

  type: "ALL" | MovementType;

  onProductChange: (value: string) => void;

  onTypeChange: (value: "ALL" | MovementType) => void;

  onReset: () => void;
}

export default function InventoryFilters({
  products,
  productId,
  type,
  onProductChange,
  onTypeChange,
  onReset,
}: InventoryFiltersProps) {
  const hasFilters = productId !== "ALL" || type !== "ALL";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={productId} onValueChange={(value) => onProductChange(value ?? "ALL")}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Product" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Products</SelectItem>

            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={type}
          onValueChange={(value) => onTypeChange(value as "ALL" | MovementType)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Movement type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">All Movements</SelectItem>

            <SelectItem value="IN">Stock IN</SelectItem>

            <SelectItem value="OUT">Stock OUT</SelectItem>
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
