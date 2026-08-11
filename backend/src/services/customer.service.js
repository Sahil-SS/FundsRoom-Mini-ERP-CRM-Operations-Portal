const { prisma } = require("../config/database");

const createCustomer = async (customerData, userId) => {
  const customer = await prisma.customer.create({
    data: {
      name: customerData.name,
      mobile: customerData.mobile,
      email: customerData.email || null,
      businessName: customerData.businessName || null,
      gstNumber: customerData.gstNumber || null,
      type: customerData.type,
      address: customerData.address || null,
      status: customerData.status || "LEAD",
      followUpDate: customerData.followUpDate
        ? new Date(customerData.followUpDate)
        : null,
      notes: customerData.notes || null,
      createdById: userId,
    },
  });

  return customer;
};

const getCustomers = async ({ page = 1, limit = 10, search, status, type }) => {
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
        mobile: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        businessName: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.customer.count({
      where,
    }),
  ]);

  return {
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCustomerById = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      followUps: {
        orderBy: {
          followUpDate: "desc",
        },
      },
      challans: {
        select: {
          id: true,
          challanNumber: true,
          status: true,
          totalQuantity: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  return customer;
};

const updateCustomer = async (customerId, customerData) => {
  const existingCustomer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!existingCustomer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  const customer = await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      ...(customerData.name !== undefined && {
        name: customerData.name,
      }),

      ...(customerData.mobile !== undefined && {
        mobile: customerData.mobile,
      }),

      ...(customerData.email !== undefined && {
        email: customerData.email || null,
      }),

      ...(customerData.businessName !== undefined && {
        businessName: customerData.businessName || null,
      }),

      ...(customerData.gstNumber !== undefined && {
        gstNumber: customerData.gstNumber || null,
      }),

      ...(customerData.type !== undefined && {
        type: customerData.type,
      }),

      ...(customerData.address !== undefined && {
        address: customerData.address || null,
      }),

      ...(customerData.status !== undefined && {
        status: customerData.status,
      }),

      ...(customerData.followUpDate !== undefined && {
        followUpDate: customerData.followUpDate
          ? new Date(customerData.followUpDate)
          : null,
      }),

      ...(customerData.notes !== undefined && {
        notes: customerData.notes || null,
      }),
    },
  });

  return customer;
};

module.exports = {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
};
