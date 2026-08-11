"use client";

import { useQuery } from "@tanstack/react-query";

import { customersApi } from "@/lib/api/customers";
import { queryKeys } from "@/lib/query/queryKeys";
import type { CustomerListParams } from "@/types/customer";

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: queryKeys.customers.list(params as Record<string, unknown>),
    queryFn: () => customersApi.getAll(params),
    placeholderData: (previousData) => previousData,
  });
}
