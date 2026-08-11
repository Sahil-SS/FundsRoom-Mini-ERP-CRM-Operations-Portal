import { apiClient } from "@/lib/api/client";
import type {
  CustomerListParams,
  CustomerListResponse,
} from "@/types/customer";

export const customersApi = {
  getAll: async (
    params: CustomerListParams = {},
  ): Promise<CustomerListResponse> => {
    const response = await apiClient.get<CustomerListResponse>("/customers", {
      params,
    });

    return response.data;
  },
};
