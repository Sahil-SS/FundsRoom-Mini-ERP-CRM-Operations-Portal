"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  createChallanSchema,
  type CreateChallanFormValues,
} from "@/schemas/challan.schema";

import type { Customer } from "@/types/customer";

import type { Product } from "@/types/product";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ChallanItems from "@/components/challans/ChallanItems";

interface ChallanFormProps {
  customers: Customer[];

  products: Product[];

  isSubmitting: boolean;

  serverError?: string;

  onSubmit: (values: CreateChallanFormValues) => void;

  onCancel: () => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ChallanForm({
  customers,
  products,
  isSubmitting,
  serverError,
  onSubmit,
  onCancel,
}: ChallanFormProps) {
  const form = useForm<CreateChallanFormValues>({
    resolver: zodResolver(createChallanSchema),

    defaultValues: {
      customerId: "",
      items: [
        {
          productId: "",
          quantity: 1,
        },
      ],
    },
  });

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  // eslint-disable-next-line react-hooks/incompatible-library
  const customerId = watch("customerId");

  const items = watch("items");

  const totalQuantity = items.reduce(
    (total, item) =>
      total + (Number.isFinite(item.quantity) ? item.quantity : 0),
    0,
  );

  const totalAmount = items.reduce((total, item) => {
    const product = products.find((product) => product.id === item.productId);

    if (!product) {
      return total;
    }

    return total + product.unitPrice * (item.quantity || 0);
  }, 0);

  function addItem() {
    setValue(
      "items",
      [
        ...items,
        {
          productId: "",
          quantity: 1,
        },
      ],
      {
        shouldValidate: true,
      },
    );
  }

  function removeItem(index: number) {
    if (items.length === 1) {
      return;
    }

    setValue(
      "items",
      items.filter((_, itemIndex) => itemIndex !== index),
      {
        shouldValidate: true,
      },
    );
  }

  function updateProduct(index: number, productId: string) {
    const updatedItems = items.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            productId,
          }
        : item,
    );

    setValue("items", updatedItems, {
      shouldValidate: true,
    });
  }

  function updateQuantity(index: number, quantity: number) {
    const updatedItems = items.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            quantity,
          }
        : item,
    );

    setValue("items", updatedItems, {
      shouldValidate: true,
    });
  }

  const itemErrors = Array.isArray(errors.items)
    ? errors.items.reduce(
        (result, error, index) => {
          if (!error) {
            return result;
          }

          result[index] = {
            productId: error.productId?.message,
            quantity: error.quantity?.message,
          };

          return result;
        },
        {} as Record<
          number,
          {
            productId?: string;
            quantity?: string;
          }
        >,
      )
    : {};
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-800">{serverError}</p>
        </div>
      )}

      {/* Customer */}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">
          Customer
          <span className="ml-1 text-red-500">*</span>
        </label>

        <Select
          value={customerId ?? ""}
          onValueChange={(value) =>
            setValue("customerId", value ?? "", {
              shouldValidate: true,
            })
          }
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a customer" />
          </SelectTrigger>

          <SelectContent>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
                {customer.businessName ? ` — ${customer.businessName}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.customerId && (
          <p className="text-xs font-medium text-red-600">
            {errors.customerId.message}
          </p>
        )}
      </div>

      {/* Products */}

      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900">Products</h3>

          <p className="mt-1 text-sm text-slate-500">
            Add each product once and specify the quantity.
          </p>
        </div>

        {errors.items?.message && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">
              {errors.items.message}
            </p>
          </div>
        )}

        <ChallanItems
          products={products}
          items={items}
          onAdd={addItem}
          onRemove={removeItem}
          onProductChange={updateProduct}
          onQuantityChange={updateQuantity}
          errors={itemErrors}
        />
      </div>

      {/* Summary */}

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Total Quantity</p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {totalQuantity.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="sm:text-right">
            <p className="text-sm text-slate-500">Estimated Total</p>

            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Final total is calculated by the backend from the product price
          snapshots.
        </p>
      </div>

      {/* Actions */}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting || products.length === 0}>
          {isSubmitting ? "Creating Draft..." : "Create Draft"}
        </Button>
      </div>
    </form>
  );
}
