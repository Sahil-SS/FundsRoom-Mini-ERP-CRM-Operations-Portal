const { prisma } = require("../config/database");

const generateChallanNumber = async () => {
  const lastChallan = await prisma.challan.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      challanNumber: true,
    },
  });

  if (!lastChallan) {
    return "SC-000001";
  }

  const lastNumber = parseInt(lastChallan.challanNumber.replace("SC-", ""), 10);

  const nextNumber = lastNumber + 1;

  return `SC-${String(nextNumber).padStart(6, "0")}`;
};

const createChallan = async (challanData, userId) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: challanData.customerId,
    },
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  const productIds = challanData.items.map((item) => item.productId);

  const uniqueProductIds = [...new Set(productIds)];

  if (uniqueProductIds.length !== productIds.length) {
    const error = new Error(
      "A product cannot appear more than once in a challan",
    );

    error.statusCode = 400;
    throw error;
  }

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: uniqueProductIds,
      },
    },
  });

  if (products.length !== uniqueProductIds.length) {
    const error = new Error("One or more products were not found");

    error.statusCode = 404;
    throw error;
  }

  const productMap = new Map(products.map((product) => [product.id, product]));

  const items = challanData.items.map((item) => {
    const product = productMap.get(item.productId);

    return {
      productId: product.id,
      quantity: item.quantity,
      unitPriceSnapshot: product.unitPrice,
      productNameSnapshot: product.name,
      skuSnapshot: product.sku,
    };
  });

  const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);

  //   const totalAmount = items.reduce(
  //     (total, item) => total + Number(item.unitPrice) * item.quantity,
  //     0,
  //   );

  const challanNumber = await generateChallanNumber();

  const challan = await prisma.challan.create({
    data: {
      challanNumber,
      customerId: challanData.customerId,
      createdById: userId,
      status: "DRAFT",
      totalQuantity,

      items: {
        create: items,
      },
    },

    include: {
      customer: true,
      items: true,
    },
  });

  const totalAmount = challan.items.reduce((total, item) => {
    return total + Number(item.unitPriceSnapshot) * item.quantity;
  }, 0);

  return {
    ...challan,
    totalAmount,
  };
  return challan;
};

const getChallans = async ({ page = 1, limit = 10, status, customerId }) => {
  const skip = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (customerId) {
    where.customerId = customerId;
  }

  const [challans, total] = await Promise.all([
    prisma.challan.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },

      include: {
        customer: {
          select: {
            id: true,
            name: true,
            businessName: true,
          },
        },

        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },

        items: {
          select: {
            quantity: true,
            unitPriceSnapshot: true,
          },
        },
      },
    }),

    prisma.challan.count({
      where,
    }),
  ]);

  const challansWithTotal = challans.map((challan) => {
    const totalAmount = challan.items.reduce((total, item) => {
      return total + Number(item.unitPriceSnapshot) * item.quantity;
    }, 0);

    return {
      ...challan,
      totalAmount,
    };
  });

  return {
    challans: challansWithTotal,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getChallanById = async (challanId) => {
  const challan = await prisma.challan.findUnique({
    where: {
      id: challanId,
    },

    include: {
      customer: true,

      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },

      items: true,
    },
  });

  if (!challan) {
    const error = new Error("Challan not found");
    error.statusCode = 404;
    throw error;
  }

  const totalAmount = challan.items.reduce((total, item) => {
    return total + Number(item.unitPriceSnapshot) * item.quantity;
  }, 0);

  return {
    ...challan,
    totalAmount,
  };
};

const confirmChallan = async (challanId, userId) => {
  const result = await prisma.$transaction(async (tx) => {
    const challan = await tx.challan.findUnique({
      where: {
        id: challanId,
      },
      include: {
        items: true,
      },
    });

    if (!challan) {
      const error = new Error("Challan not found");
      error.statusCode = 404;
      throw error;
    }

    if (challan.status !== "DRAFT") {
      const error = new Error(
        `Only DRAFT challans can be confirmed. Current status: ${challan.status}`,
      );

      error.statusCode = 400;
      throw error;
    }

    const productIds = challan.items.map((item) => item.productId);

    const products = await tx.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      const error = new Error(
        "One or more products in the challan no longer exist",
      );

      error.statusCode = 400;
      throw error;
    }

    const productMap = new Map(
      products.map((product) => [product.id, product]),
    );

    // Check stock for every item BEFORE changing anything
    for (const item of challan.items) {
      const product = productMap.get(item.productId);

      if (product.currentStock < item.quantity) {
        const error = new Error(
          `Insufficient stock for ${product.name}. Available: ${product.currentStock}, Required: ${item.quantity}`,
        );

        error.statusCode = 400;
        throw error;
      }
    }

    // All stock is available.
    // Now update stock and create movement records.
    for (const item of challan.items) {
      const product = productMap.get(item.productId);

      await tx.product.update({
        where: {
          id: product.id,
        },
        data: {
          currentStock: product.currentStock - item.quantity,
        },
      });

      await tx.stockMovement.create({
        data: {
          productId: product.id,
          quantity: item.quantity,
          type: "OUT",
          reason: `Challan ${challan.challanNumber}`,
          createdById: userId,
        },
      });
    }

    const confirmedChallan = await tx.challan.update({
      where: {
        id: challan.id,
      },
      data: {
        status: "CONFIRMED",
      },
      include: {
        customer: true,
        items: true,
      },
    });

    return confirmedChallan;
  });

  return result;
};

module.exports = {
  createChallan,
  getChallans,
  getChallanById,
  confirmChallan,
};
