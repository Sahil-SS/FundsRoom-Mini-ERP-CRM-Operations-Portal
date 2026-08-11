"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { inventoryApi } from "@/lib/api/inventory";

import { queryKeys } from "@/lib/query/queryKeys";

import type {
  InventoryListParams,
  StockMovementPayload,
} from "@/types/inventory";

export function useInventory(params: InventoryListParams) {
  return useQuery({
    // queryKeys.inventory.list expects a Record<string, unknown> — cast params to satisfy the signature
    queryKey: queryKeys.inventory.list(params as unknown as Record<string, unknown>),

    queryFn: () => inventoryApi.getMovements(params),

    placeholderData: (previousData) => previousData,
  });
}

export function useProductInventory(productId: string) {
  return useQuery({
    queryKey: queryKeys.inventory.product(productId),

    queryFn: () => inventoryApi.getProductInventory(productId),

    enabled: Boolean(productId),
  });
}

export function useCreateStockMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: StockMovementPayload) =>
      inventoryApi.createMovement(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.inventory.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      });
    },
  });
}
