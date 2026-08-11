"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { customersApi } from "@/lib/api/customers";
import { queryKeys } from "@/lib/query/queryKeys";

import type { CustomerListParams } from "@/types/customer";

import type { CustomerFormValues } from "@/schemas/customer.schema";

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(params as Record<string, unknown>),
    queryFn: () => customersApi.getAll(params),
    placeholderData: (previousData) => previousData,
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: queryKeys.customers.detail(id),
    queryFn: () => customersApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CustomerFormValues) => customersApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CustomerFormValues>;
    }) => customersApi.update(id, payload),

    onSuccess: (customer) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.all,
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(customer.id),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary,
      });
    },
  });
}
