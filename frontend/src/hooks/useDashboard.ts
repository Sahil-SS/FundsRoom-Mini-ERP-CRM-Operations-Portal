"use client";

import { useQuery } from "@tanstack/react-query";

import { dashboardApi } from "@/lib/api/dashboard";
import { queryKeys } from "@/lib/query/queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: dashboardApi.getSummary,
  });
}
