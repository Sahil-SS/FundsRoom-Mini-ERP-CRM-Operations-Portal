"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { challansApi } from "@/lib/api/challans";

import { queryKeys } from "@/lib/query/queryKeys";

import type { ChallanListParams, CreateChallanPayload } from "@/types/challan";

export function useChallans(params: ChallanListParams) {
  return useQuery({
    queryKey: queryKeys.challans.list(params as Record<string, unknown>),

    queryFn: () => challansApi.getChallans(params),

    placeholderData: (previousData) => previousData,
  });
}

export function useChallan(id: string) {
  return useQuery({
    queryKey: queryKeys.challans.detail(id),

    queryFn: () => challansApi.getChallan(id),

    enabled: Boolean(id),
  });
}

export function useCreateChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChallanPayload) =>
      challansApi.createChallan(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challans.all,
      });
    },
  });
}

export function useConfirmChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => challansApi.confirmChallan(id),

    onSuccess: (challan) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challans.all,
      });

      queryClient.setQueryData(queryKeys.challans.detail(challan.id), challan);

      /*
       * Confirmation changes inventory,
       * so invalidate inventory/product
       * queries as well.
       */
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

export function useCancelChallan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => challansApi.cancelChallan(id),

    onSuccess: (challan) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.challans.all,
      });

      queryClient.setQueryData(queryKeys.challans.detail(challan.id), challan);

      /*
       * Cancellation can restore stock
       * for a previously CONFIRMED challan.
       */
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
