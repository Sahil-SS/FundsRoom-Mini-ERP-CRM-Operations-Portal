import { apiClient } from "@/lib/api/client";

import type {
  InventoryListParams,
  InventoryListResponse,
  StockMovementPayload,
  InventoryMovement,
} from "@/types/inventory";

export const inventoryApi = {
  getMovements: async (
    params: InventoryListParams = {},
  ): Promise<InventoryListResponse> => {
    const response = await apiClient.get<InventoryListResponse>(
      "/inventory/movements",
      {
        params,
      },
    );

    return response.data;
  },

  createMovement: async (payload: StockMovementPayload) => {
    const response = await apiClient.post<{
      success: boolean;
      data: {
        movement: InventoryMovement;
        product: {
          id: string;
          currentStock: number;
        };
      };
    }>("/inventory/movements", payload);

    return response.data.data;
  },

  getMovementById: async (id: string): Promise<InventoryMovement> => {
    const response = await apiClient.get<{
      success: boolean;
      data: InventoryMovement;
    }>(`/inventory/movements/${id}`);

    return response.data.data;
  },

  getProductInventory: async (productId: string) => {
    const response = await apiClient.get<{
      success: boolean;
      data: {
        product: unknown;
        movements: InventoryMovement[];
      };
    }>(`/inventory/products/${productId}/stock-movements`);

    return response.data.data;
  },
};
