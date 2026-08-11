export type MovementType = "IN" | "OUT";

export interface InventoryMovement {
  id: string;
  productId: string;
  quantity: number;
  type: MovementType;
  reason: string;
  createdAt: string;

  product?: {
    id: string;
    name: string;
    sku: string;
  };

  createdBy?: {
    id: string;
    name: string;
    role: "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";
  };
}

export interface InventoryListParams {
  page?: number;
  limit?: number;
  productId?: string;
  type?: MovementType;
}

export interface InventoryListResponse {
  success: boolean;
  data: InventoryMovement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StockMovementPayload {
  productId: string;
  quantity: number;
  type: MovementType;
}
