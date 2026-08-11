"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  productSchema,
  type ProductFormValues,
} from "@/schemas/product.schema";

import type { Product } from "@/types/product";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

interface ProductFormProps {
  mode: "create" | "edit";

  initialData?: Product;

  isSubmitting: boolean;

  serverError?: string;

  onSubmit: (values: ProductFormValues) => void;

  onCancel: () => void;
}

export default function ProductForm({
  mode,
  initialData,
  isSubmitting,
  serverError,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),

    defaultValues: {
      name: "",
      sku: "",
      category: "",
      unitPrice: 0,
      minimumStock: 0,
      warehouseLocation: "",
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      name: initialData.name,
      sku: initialData.sku,
      category: initialData.category,
      unitPrice: initialData.unitPrice,
      minimumStock: initialData.minimumStock,
      warehouseLocation: initialData.warehouseLocation ?? "",
    });
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">{serverError}</p>
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Product Information</h3>

          <p className="mt-1 text-sm text-slate-500">
            Define the product master information.
          </p>
        </div>

        <div className="grid gap-5 p-5 md:grid-cols-2">
          <FormField label="Product Name" required error={errors.name?.message}>
            <Input
              {...register("name")}
              placeholder="e.g. Dell 24-inch Monitor"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField label="SKU" required error={errors.sku?.message}>
            <Input
              {...register("sku")}
              placeholder="e.g. MON-001"
              disabled={isSubmitting}
              className={mode === "edit" ? "uppercase" : undefined}
            />
          </FormField>

          <FormField label="Category" required error={errors.category?.message}>
            <Input
              {...register("category")}
              placeholder="e.g. Displays"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label="Unit Price"
            required
            error={errors.unitPrice?.message}
          >
            <Input
              type="number"
              step="0.01"
              min="0"
              {...register("unitPrice", {
                valueAsNumber: true,
              })}
              placeholder="0.00"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label="Minimum Stock"
            required
            error={errors.minimumStock?.message}
          >
            <Input
              type="number"
              min="0"
              step="1"
              {...register("minimumStock", {
                valueAsNumber: true,
              })}
              placeholder="10"
              disabled={isSubmitting}
            />
          </FormField>

          <FormField
            label="Warehouse Location"
            required
            error={errors.warehouseLocation?.message}
          >
            <Input
              {...register("warehouseLocation")}
              placeholder="e.g. Rack A-12"
              disabled={isSubmitting}
            />
          </FormField>
        </div>
      </section>

      {mode === "edit" && initialData && (
        <section className="rounded-xl border border-slate-200 bg-slate-50">
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Current Stock
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {initialData.currentStock}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Current stock is managed through inventory movements and cannot be
              edited from the product master.
            </p>
          </div>
        </section>
      )}

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
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Product"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-slate-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </label>

      {children}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
