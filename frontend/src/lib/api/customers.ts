import { apiClient } from "@/lib/api/client";

import type {
  Customer,
  CustomerListParams,
  CustomerListResponse,
} from "@/types/customer";

import type { CustomerFormValues } from "@/schemas/customer.schema";

export const customersApi = {
  getAll: async (
    params: CustomerListParams = {},
  ): Promise<CustomerListResponse> => {
    const response = await apiClient.get<CustomerListResponse>("/customers", {
      params,
    });

    return response.data;
  },

  getById: async (id: string): Promise<Customer> => {
    const response = await apiClient.get<{
      success: boolean;
      data: Customer;
    }>(`/customers/${id}`);

    return response.data.data;
  },

  create: async (payload: CustomerFormValues): Promise<Customer> => {
    const response = await apiClient.post<{
      success: boolean;
      data: Customer;
    }>("/customers", payload);

    return response.data.data;
  },

  update: async (
    id: string,
    payload: Partial<CustomerFormValues>,
  ): Promise<Customer> => {
    const response = await apiClient.put<{
      success: boolean;
      data: Customer;
    }>(`/customers/${id}`, payload);

    return response.data.data;
  },
};
