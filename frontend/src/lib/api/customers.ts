import { apiClient } from "@/lib/api/client";

import type {
  Customer,
  CustomerDetailsResponse,
  CustomerListParams,
  CustomerListResponse,
  CreateFollowUpPayload,
  FollowUpsResponse,
  FollowUpResponse,
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

  getById: async (id: string): Promise<CustomerDetailsResponse["data"]> => {
    const response = await apiClient.get<CustomerDetailsResponse>(
      `/customers/${id}`,
    );

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

  getFollowUps: async (id: string): Promise<FollowUpsResponse> => {
    const response = await apiClient.get<FollowUpsResponse>(
      `/customers/${id}/follow-ups`,
    );

    return response.data;
  },

  createFollowUp: async (
    id: string,
    payload: CreateFollowUpPayload,
  ): Promise<FollowUpResponse> => {
    const response = await apiClient.post<FollowUpResponse>(
      `/customers/${id}/follow-ups`,
      payload,
    );

    return response.data;
  },
};
