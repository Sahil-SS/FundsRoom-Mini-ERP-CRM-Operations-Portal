export type CustomerType = "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";

export type CustomerStatus = "LEAD" | "ACTIVE" | "INACTIVE";

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
