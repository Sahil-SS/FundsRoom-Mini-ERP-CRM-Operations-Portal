import { apiClient } from "@/lib/api/client";
import type { DashboardResponse } from "@/types/dashboard";

export const dashboardApi = {
  getSummary: async (): Promise<DashboardResponse> => {
    const response = await apiClient.get<DashboardResponse>("/dashboard");

    return response.data;
  },
};
