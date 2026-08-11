export type CustomerType = "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";

export type CustomerStatus = "LEAD" | "ACTIVE" | "INACTIVE";

export interface FollowUp {
  id: string;
  customerId: string;
  note: string;
  followUpDate: string;
  createdAt: string;
}

export interface RelatedChallan {
  id: string;
  challanNumber: string;
  status: string;
  totalQuantity: number;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  businessName: string | null;
  gstNumber: string | null;
  type: CustomerType;
  address: string | null;
  status: CustomerStatus;
  followUpDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDetailsResponse {
  success: boolean;
  data: Customer & {
    followUps?: FollowUp[];
    challans?: RelatedChallan[];
  };
}

export interface CustomerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CustomerListResponse {
  success: boolean;
  data: Customer[];
  pagination: CustomerPagination;
}

export interface CustomerListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CustomerStatus;
  type?: CustomerType;
}

export interface CreateFollowUpPayload {
  note: string;
  followUpDate: string;
}

export interface FollowUpResponse {
  success: boolean;
  data: FollowUp;
}

export interface FollowUpsResponse {
  success: boolean;
  data: FollowUp[];
}
