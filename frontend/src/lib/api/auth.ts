import { apiClient } from "@/lib/api/client";
import type { LoginRequest, LoginResponse } from "@/types/auth";

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      payload,
    );

    return response.data;
  },
};
