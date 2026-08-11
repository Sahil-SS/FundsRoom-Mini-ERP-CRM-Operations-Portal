"use client";

import { useMutation } from "@tanstack/react-query";

import { authApi } from "@/lib/api/auth";
import { useAuthContext } from "@/providers/AuthProvider";
import type { LoginRequest } from "@/types/auth";

export function useAuth() {
  const auth = useAuthContext();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginRequest) => authApi.login(payload),

    onSuccess: (response) => {
      auth.login(response.data.token, response.data.user);
    },
  });

  return {
    ...auth,
    loginMutation,
  };
}
