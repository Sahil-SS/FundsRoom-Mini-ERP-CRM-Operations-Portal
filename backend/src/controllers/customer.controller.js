const customerService = require("../services/customer.service");

const createCustomer = async (req, res, next) => {
  try {
    const customer = await customerService.createCustomer(
      req.body,
      req.user.id,
    );

    return res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCustomer,
};
