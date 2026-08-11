const { prisma } = require("../config/database");

const createProduct = async (productData) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      sku: productData.sku,
    },
  });

  if (existingProduct) {
    const error = new Error("A product with this SKU already exists");
    error.statusCode = 409;
    throw error;
  }

  const product = await prisma.product.create({
    data: {
      name: productData.name,
      sku: productData.sku,
      category: productData.category,
      unitPrice: productData.unitPrice,
      minimumStock: productData.minimumStock || 0,
      warehouseLocation: productData.warehouseLocation || null,
    },
  });

  return product;
};

const getProducts = async ({
  page = 1,
  limit = 10,
  search,
  category,
  lowStock,
}) => {
  const skip = (page - 1) * limit;

  const where = {};

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        sku: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (category) {
    where.category = {
      equals: category,
      mode: "insensitive",
    };
  }

//   if (lowStock === "true") {
//     where.currentStock = {
//       lte: {
        
//       },
//     };
//   }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count({
      where,
    }),
  ]);

  let filteredProducts = products;

  // Prisma does not support comparing currentStock and
  // minimumStock directly in a normal findMany filter.
  // Since this endpoint is paginated, we'll handle the
  // low-stock filter separately below.
  if (lowStock === "true") {
    filteredProducts = products.filter(
      (product) => product.currentStock <= product.minimumStock,
    );
  }

  return {
    products: filteredProducts,
    pagination: {
      page,
      limit,
      total: lowStock === "true" ? filteredProducts.length : total,
      totalPages:
        lowStock === "true"
          ? Math.ceil(filteredProducts.length / limit)
          : Math.ceil(total / limit),
    },
  };
};

const getProductById = async (productId) => {
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

  return product;
};

const updateProduct = async (productId, productData) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!existingProduct) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (productData.sku && productData.sku !== existingProduct.sku) {
    const skuExists = await prisma.product.findUnique({
      where: {
        sku: productData.sku,
      },
    });

    if (skuExists) {
      const error = new Error("A product with this SKU already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      ...(productData.name !== undefined && {
        name: productData.name,
      }),

      ...(productData.sku !== undefined && {
        sku: productData.sku,
      }),

      ...(productData.category !== undefined && {
        category: productData.category,
      }),

      ...(productData.unitPrice !== undefined && {
        unitPrice: productData.unitPrice,
      }),

      ...(productData.minimumStock !== undefined && {
        minimumStock: productData.minimumStock,
      }),

      ...(productData.warehouseLocation !== undefined && {
        warehouseLocation: productData.warehouseLocation || null,
      }),
    },
  });

  return product;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
};
