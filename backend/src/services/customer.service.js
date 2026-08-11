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

module.exports = {
  createCustomer,
};
