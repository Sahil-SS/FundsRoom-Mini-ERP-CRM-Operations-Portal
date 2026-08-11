const inventoryService = require("../services/inventory.service");

const createStockMovement = async (req, res, next) => {
  try {
    const result = await inventoryService.createStockMovement(
      req.body,
      req.user.id,
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getStockMovements = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const { productId, type } = req.query;

    const result = await inventoryService.getStockMovements({
      page,
      limit,
      productId,
      type,
    });

    return res.status(200).json({
      success: true,
      data: result.movements,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getStockMovementById = async (req, res, next) => {
  try {
    const movement = await inventoryService.getStockMovementById(req.params.id);

    return res.status(200).json({
      success: true,
      data: movement,
    });
  } catch (error) {
    next(error);
  }
};

const getProductStockMovements = async (req, res, next) => {
  try {
    const result = await inventoryService.getProductStockMovements(
      req.params.productId,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStockMovement,
  getStockMovements,
  getStockMovementById,
  getProductStockMovements,
};
