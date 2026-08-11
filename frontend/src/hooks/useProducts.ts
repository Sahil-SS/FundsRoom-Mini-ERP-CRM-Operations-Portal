"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { productsApi } from "@/lib/api/products";

import { queryKeys } from "@/lib/query/queryKeys";

import type { ProductListParams } from "@/types/product";

import type { ProductFormValues } from "@/schemas/product.schema";

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

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProductFormValues) => productsApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ProductFormValues>;
    }) => productsApi.update(id, payload),

    onSuccess: (product) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(product.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      });
    },
  });
}
