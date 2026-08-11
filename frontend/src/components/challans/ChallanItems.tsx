"use client";

import { Plus, Trash2 } from "lucide-react";

import { useMemo } from "react";

import type { Product } from "@/types/product";

import type { CreateChallanFormValues } from "@/schemas/challan.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChallanItemsProps {
  products: Product[];

  items: CreateChallanFormValues["items"];

  onAdd: () => void;

  onRemove: (index: number) => void;

  onProductChange: (index: number, productId: string) => void;

  onQuantityChange: (index: number, quantity: number) => void;

  errors?: Record<
    number,
    {
      productId?: string;
      quantity?: string;
    }
  >;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ChallanItems({
  products,
  items,
  onAdd,
  onRemove,
  onProductChange,
  onQuantityChange,
  errors,
}: ChallanItemsProps) {
  const usedProductIds = useMemo(
    () => new Set(items.map((item) => item.productId).filter(Boolean)),
    [items],
  );

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const selectedProduct = products.find(
          (product) => product.id === item.productId,
        );

        const lineTotal = selectedProduct
          ? selectedProduct.unitPrice * (item.quantity || 0)
          : 0;

        return (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_120px_160px_160px_auto] lg:items-end">
              {/* Product */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Product
                </label>

                <Select
                  value={item.productId || ""}
                  onValueChange={(value) => onProductChange(index, value ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>

                  <SelectContent>
                    {products.map((product) => {
                      const usedByAnotherRow =
                        usedProductIds.has(product.id) &&
                        product.id !== item.productId;

                      return (
                        <SelectItem
                          key={product.id}
                          value={product.id}
                          disabled={usedByAnotherRow}
                        >
                          {product.name} ({product.sku})
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                {errors?.[index]?.productId && (
                  <p className="text-xs font-medium text-red-600">
                    {errors[index]?.productId}
                  </p>
                )}

                {selectedProduct && (
                  <p className="text-xs text-slate-500">
                    Available stock:{" "}
                    <span className="font-medium text-slate-700">
                      {selectedProduct.currentStock}
                    </span>
                  </p>
                )}
              </div>

              {/* Quantity */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Quantity
                </label>

                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={item.quantity || ""}
                  onChange={(event) => {
                    const value = Number(event.target.value);

                    onQuantityChange(index, value);
                  }}
                />

                {errors?.[index]?.quantity && (
                  <p className="text-xs font-medium text-red-600">
                    {errors[index]?.quantity}
                  </p>
                )}
              </div>

              {/* Unit Price */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Unit Price
                </label>

                <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700">
                  {selectedProduct
                    ? formatCurrency(selectedProduct.unitPrice)
                    : "—"}
                </div>
              </div>

              {/* Total */}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Line Total
                </label>

                <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900">
                  {selectedProduct ? formatCurrency(lineTotal) : "—"}
                </div>
              </div>

              {/* Remove */}

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemove(index)}
                disabled={items.length === 1}
                aria-label="Remove product"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </div>
        );
      })}

      <Button type="button" variant="outline" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  );
}
