"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  stockMovementSchema,
  type StockMovementFormValues,
} from "@/schemas/inventory.schema";

import type { MovementType } from "@/types/inventory";

import type { Product } from "@/types/product";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StockMovementFormProps {
  products: Product[];

  isSubmitting: boolean;

  serverError?: string;

  onSubmit: (values: StockMovementFormValues) => void;

  onCancel: () => void;
}

export default function StockMovementForm({
  products,
  isSubmitting,
  serverError,
  onSubmit,
  onCancel,
}: StockMovementFormProps) {
  const form = useForm<StockMovementFormValues>({
    resolver: zodResolver(stockMovementSchema),

    defaultValues: {
      productId: "",
      type: "IN",
      quantity: undefined,
      reason: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = form;

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedProductId = watch("productId");

  const selectedType = watch("type");

  const selectedProduct = products.find(
    (product) => product.id === selectedProductId,
  );

  useEffect(() => {
    reset({
      productId: "",
      type: "IN",
      quantity: undefined,
      reason: "",
    });
  }, [reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">{serverError}</p>

          {selectedType === "OUT" && selectedProduct && (
            <p className="mt-1 text-xs text-red-700">
              Available stock: {selectedProduct.currentStock}
            </p>
          )}
        </div>
      )}

      {/* Product */}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Product
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Select
          value={selectedProductId ?? ""}
          onValueChange={(value) =>
            setValue("productId", value ?? "", {
              shouldValidate: true,
            })
          }
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a product" />
          </SelectTrigger>

          <SelectContent>
            {products.length === 0 ? (
              <SelectItem value="NO_PRODUCTS" disabled>
                No products available
              </SelectItem>
            ) : (
              products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {errors.productId && (
          <p className="text-xs font-medium text-red-600">
            {errors.productId.message}
          </p>
        )}

        {selectedProduct && (
          <div className="rounded-lg bg-slate-50 p-3">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-slate-500">
              <span>
                Current stock:{" "}
                <strong className="text-slate-800">
                  {selectedProduct.currentStock}
                </strong>
              </span>

              <span>
                Minimum stock:{" "}
                <strong className="text-slate-800">
                  {selectedProduct.minimumStock}
                </strong>
              </span>

              <span>
                Location:{" "}
                <strong className="text-slate-800">
                  {selectedProduct.warehouseLocation || "—"}
                </strong>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Movement Type */}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Movement Type
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Select
          value={selectedType}
          onValueChange={(value) =>
            setValue("type", value as MovementType, {
              shouldValidate: true,
            })
          }
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="IN">Stock IN</SelectItem>

            <SelectItem value="OUT">Stock OUT</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className="text-xs font-medium text-red-600">
            {errors.type.message}
          </p>
        )}

        <p className="text-xs text-slate-400">
          {selectedType === "IN"
            ? "Adds stock to the selected product."
            : "Removes stock from the selected product. The backend will reject the movement if stock is insufficient."}
        </p>
      </div>

      {/* Quantity */}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Quantity
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Input
          type="number"
          min="1"
          step="1"
          placeholder="Enter quantity"
          disabled={isSubmitting}
          {...register("quantity", {
            valueAsNumber: true,
          })}
        />

        {errors.quantity && (
          <p className="text-xs font-medium text-red-600">
            {errors.quantity.message}
          </p>
        )}
      </div>

      {/* Reason */}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Reason
          <span className="ml-1 text-red-500">*</span>
        </label>

        <textarea
          {...register("reason")}
          disabled={isSubmitting}
          placeholder="e.g. New stock received from supplier"
          rows={4}
          className="flex min-h-25 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        />

        {errors.reason && (
          <p className="text-xs font-medium text-red-600">
            {errors.reason.message}
          </p>
        )}
      </div>

      {/* Actions */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Recording..." : "Record Movement"}
        </Button>
      </div>
    </form>
  );
}
