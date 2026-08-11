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

    followUps: (id: string) => ["customers", "follow-ups", id] as const,
  },

  products: {
    all: ["products"] as const,

    list: (params: Record<string, unknown>) =>
      ["products", "list", params] as const,

    detail: (id: string) => ["products", "detail", id] as const,
  },

  inventory: {
    all: ["inventory"] as const,

    list: (params: Record<string, unknown>) =>
      ["inventory", "list", params] as const,

    product: (productId: string) =>
      ["inventory", "product", productId] as const,
  },

  challans: {
    all: ["challans"] as const,
  },
};
