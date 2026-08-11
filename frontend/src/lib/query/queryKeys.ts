export const queryKeys = {
  dashboard: {
    all: ["dashboard"] as const,
    summary: ["dashboard", "summary"] as const,
  },

  customers: {
    all: ["customers"] as const,
    list: (params: Record<string, unknown>) =>
      ["customers", "list", params] as const,
    detail: (id: string) => ["customers", "detail", id] as const,
  },

  products: {
    all: ["products"] as const,
  },

  inventory: {
    all: ["inventory"] as const,
  },

  challans: {
    all: ["challans"] as const,
  },
};
