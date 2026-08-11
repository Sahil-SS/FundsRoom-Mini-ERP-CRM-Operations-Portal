export type ChallanStatus = "DRAFT" | "CONFIRMED" | "CANCELLED";

export interface ChallanCustomer {
  id: string;
  name: string;
  businessName?: string | null;
}

export interface ChallanCreatedBy {
  id: string;
  name: string;
  role: "ADMIN" | "SALES" | "WAREHOUSE" | "ACCOUNTS";
}

export interface ChallanItem {
  id: string;
  challanId: string;
  productId: string;
  quantity: number;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: number;
}

export interface Challan {
  id: string;
  challanNumber: string;
  customerId: string;
  status: ChallanStatus;
  totalQuantity: number;
  totalAmount: number;

  customer?: ChallanCustomer;

  createdBy?: ChallanCreatedBy;

  items: ChallanItem[];

  createdAt: string;
  updatedAt: string;
}

export interface CreateChallanItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateChallanPayload {
  customerId: string;
  items: CreateChallanItemPayload[];
}

export interface ChallanListParams {
  page?: number;
  limit?: number;
  status?: ChallanStatus;
  customerId?: string;
}

export interface ChallanListResponse {
  success: boolean;
  data: Challan[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ChallanResponse {
  success: boolean;
  data: Challan;
}
