import { apiClient } from "@/lib/api/client";

import type {
  Product,
  ProductListParams,
  ProductListResponse,
} from "@/types/product";

export const productsApi = {
  getAll: async (
    params: ProductListParams = {},
  ): Promise<ProductListResponse> => {
    const response = await apiClient.get<ProductListResponse>("/products", {
      params,
    });

    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<{
      success: boolean;
      data: Product;
    }>(`/products/${id}`);

    return response.data.data;
  },
};
