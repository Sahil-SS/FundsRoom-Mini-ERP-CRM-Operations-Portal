"use client";

import { useQuery } from "@tanstack/react-query";

import { productsApi } from "@/lib/api/products";
import { queryKeys } from "@/lib/query/queryKeys";

import type { ProductListParams } from "@/types/product";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: queryKeys.products.list(params as Record<string, unknown>),
    queryFn: () => productsApi.getAll(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),

    queryFn: () => productsApi.getById(id),

    enabled: Boolean(id),
  });
}
