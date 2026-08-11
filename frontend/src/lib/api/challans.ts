import { apiClient } from "@/lib/api/client";

import type {
  Challan,
  ChallanListParams,
  ChallanListResponse,
  ChallanResponse,
  CreateChallanPayload,
} from "@/types/challan";

export const challansApi = {
  getChallans: async (
    params: ChallanListParams = {},
  ): Promise<ChallanListResponse> => {
    const response = await apiClient.get<ChallanListResponse>("/challans", {
      params,
    });

    return response.data;
  },

  getChallan: async (id: string): Promise<Challan> => {
    const response = await apiClient.get<ChallanResponse>(`/challans/${id}`);

    return response.data.data;
  },

  createChallan: async (payload: CreateChallanPayload): Promise<Challan> => {
    const response = await apiClient.post<ChallanResponse>(
      "/challans",
      payload,
    );

    return response.data.data;
  },

  confirmChallan: async (id: string): Promise<Challan> => {
    const response = await apiClient.post<ChallanResponse>(
      `/challans/${id}/confirm`,
    );

    return response.data.data;
  },

  cancelChallan: async (id: string): Promise<Challan> => {
    const response = await apiClient.post<ChallanResponse>(
      `/challans/${id}/cancel`,
    );

    return response.data.data;
  },
};
