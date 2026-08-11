"use client";

import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import ProductStockBadge from "@/components/products/ProductStockBadge";

import type { Product } from "@/types/product";

interface CurrentInventoryTableProps {
  products: Product[];
}

export default function CurrentInventoryTable({
  products,
}: CurrentInventoryTableProps) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="font-semibold text-slate-900">No inventory found</p>

        <p className="mt-1 text-sm text-slate-500">
          No products are currently available.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-200 text-sm">
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

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Stock
              </th>

              <th className="px-5 py-3.5 text-left font-semibold text-slate-600">
                Location
              </th>

              <th className="w-20 px-5 py-3.5 text-right font-semibold text-slate-600">
                View
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
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${product.name}`}
                    onClick={() => router.push(`/products/${product.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
