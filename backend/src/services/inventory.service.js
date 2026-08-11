const { prisma } = require("../config/database");

const createStockMovement = async (movementData, userId) => {
  const result = await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: {
        id: movementData.productId,
      },
    });

    if (!product) {
      const error = new Error("Product not found");
      error.statusCode = 404;
      throw error;
    }

    let newStock;

    if (movementData.type === "IN") {
      newStock = product.currentStock + movementData.quantity;
    } else {
      if (product.currentStock < movementData.quantity) {
        const error = new Error(
          `Insufficient stock. Available stock: ${product.currentStock}`,
        );

        error.statusCode = 400;
        throw error;
      }

      newStock = product.currentStock - movementData.quantity;
    }

    const updatedProduct = await tx.product.update({
      where: {
        id: product.id,
      },
      data: {
        currentStock: newStock,
      },
    });

    const movement = await tx.stockMovement.create({
      data: {
        productId: product.id,
        quantity: movementData.quantity,
        type: movementData.type,
        reason: movementData.reason,
        createdById: userId,
      },
    });

    return {
      movement,
      product: updatedProduct,
    };
  });

  return result;
};

const getStockMovements = async ({ page = 1, limit = 10, productId, type }) => {
  const skip = (page - 1) * limit;

  const where = {};

  if (productId) {
    where.productId = productId;
  }

  if (type) {
    where.type = type;
  }

  const [movements, total] = await Promise.all([
    prisma.stockMovement.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            role: true,
          },
        },
      },
    }),

    prisma.stockMovement.count({
      where,
    }),
  ]);

  return {
    movements,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getStockMovementById = async (movementId) => {
  const movement = await prisma.stockMovement.findUnique({
    where: {
      id: movementId,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          sku: true,
          currentStock: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  if (!movement) {
    const error = new Error("Stock movement not found");
    error.statusCode = 404;
    throw error;
  }

  return movement;
};

const getProductStockMovements = async (productId) => {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const movements = await prisma.stockMovement.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          role: true,
        },
      },
    },
  });

  return {
    product,
    movements,
  };
};

module.exports = {
  createStockMovement,
  getStockMovements,
  getStockMovementById,
  getProductStockMovements,
};
