const { prisma } = require("../config/database");

const createFollowUp = async (customerId, followUpData, userId) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  const followUp = await prisma.followUp.create({
    data: {
      customerId,
      note: followUpData.note,
      followUpDate: new Date(followUpData.followUpDate),
      createdById: userId,
    },
  });

  // Keep the customer's next follow-up date updated
  await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      followUpDate: new Date(followUpData.followUpDate),
    },
  });

  return followUp;
};

const getCustomerFollowUps = async (customerId) => {
  const customer = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
  });

  if (!customer) {
    const error = new Error("Customer not found");
    error.statusCode = 404;
    throw error;
  }

  const followUps = await prisma.followUp.findMany({
    where: {
      customerId,
    },
    orderBy: {
      followUpDate: "desc",
    },
  });

  return followUps;
};

module.exports = {
  createFollowUp,
  getCustomerFollowUps,
};
