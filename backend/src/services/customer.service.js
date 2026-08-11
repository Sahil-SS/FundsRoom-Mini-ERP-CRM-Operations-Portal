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

  // Search by customer name, mobile, email or business name
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

module.exports = {
  createCustomer,
  getCustomers,
};
