const { prisma } = require("../config/database");

const getDashboard = async () => {
  const [
    totalCustomers,
    activeCustomers,
    leadCustomers,
    totalProducts,
    products,
    totalChallans,
    draftChallans,
    confirmedChallans,
    cancelledChallans,
  ] = await Promise.all([
    prisma.customer.count(),

    prisma.customer.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.customer.count({
      where: {
        status: "LEAD",
      },
    }),

    prisma.product.count(),

    prisma.product.findMany({
      select: {
        currentStock: true,
        minimumStock: true,
      },
    }),

    prisma.challan.count(),

    prisma.challan.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.challan.count({
      where: {
        status: "CONFIRMED",
      },
    }),

    prisma.challan.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  const lowStockProducts = products.filter(
    (product) => product.currentStock <= product.minimumStock,
  ).length;

  const totalStockUnits = products.reduce(
    (total, product) => total + product.currentStock,
    0,
  );

  return {
    customers: {
      total: totalCustomers,
      active: activeCustomers,
      leads: leadCustomers,
    },

    products: {
      total: totalProducts,
      lowStock: lowStockProducts,
    },

    inventory: {
      totalStockUnits,
    },

    challans: {
      total: totalChallans,
      draft: draftChallans,
      confirmed: confirmedChallans,
      cancelled: cancelledChallans,
    },
  };
};

module.exports = {
  getDashboard,
};
