export interface DashboardCustomerStats {
  total: number;
  active: number;
  leads: number;
}

export interface DashboardProductStats {
  total: number;
  lowStock: number;
}

export interface DashboardInventoryStats {
  totalStockUnits: number;
}

export interface DashboardChallanStats {
  total: number;
  draft: number;
  confirmed: number;
  cancelled: number;
}

export interface DashboardData {
  customers: DashboardCustomerStats;
  products: DashboardProductStats;
  inventory: DashboardInventoryStats;
  challans: DashboardChallanStats;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
}
