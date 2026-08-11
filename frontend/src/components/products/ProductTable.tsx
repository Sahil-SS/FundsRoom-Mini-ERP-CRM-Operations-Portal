"use client";

import { Eye, MoreHorizontal } from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ProductStockBadge from "@/components/products/ProductStockBadge";

import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function ProductTable({ products }: ProductTableProps) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
        <p className="font-semibold text-slate-900">No products found</p>

        <p className="mt-1 text-sm text-slate-500">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-237.5 text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Product
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                SKU
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Category
              </th>

              <th className="px-5 py-3.5 text-right font-semibold text-slate-600">
                Unit Price
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Stock
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Location
              </th>

              <th className="w-20 px-5 py-3.5 text-right font-semibold text-slate-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
              >
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                </td>

                <td className="px-5 py-4">
                  <code className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {product.sku}
                  </code>
                </td>

                <td className="px-5 py-4 text-slate-600">{product.category}</td>

                <td className="px-5 py-4 text-right font-medium text-slate-800">
                  {formatPrice(product.unitPrice)}
                </td>

                <td className="px-5 py-4">
                  <ProductStockBadge
                    currentStock={product.currentStock}
                    minimumStock={product.minimumStock}
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Minimum: {product.minimumStock}
                  </p>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {product.warehouseLocation || "—"}
                </td>

                <td className="px-5 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Actions for ${product.name}`}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/products/${product.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
