const challanService = require("../services/challan.service");

const createChallan = async (req, res, next) => {
  try {
    const challan = await challanService.createChallan(req.body, req.user.id);

    return res.status(201).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    next(error);
  }
};

const getChallans = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const { status, customerId } = req.query;

    const result = await challanService.getChallans({
      page,
      limit,
      status,
      customerId,
    });

    return res.status(200).json({
      success: true,
      data: result.challans,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

const getChallanById = async (req, res, next) => {
  try {
    const challan = await challanService.getChallanById(req.params.id);

    return res.status(200).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    next(error);
  }
};

const confirmChallan = async (req, res, next) => {
  try {
    const challan = await challanService.confirmChallan(
      req.params.id,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    next(error);
  }
};

const cancelChallan = async (req, res, next) => {
  try {
    const challan = await challanService.cancelChallan(
      req.params.id,
      req.user.id,
    );

    return res.status(200).json({
      success: true,
      data: challan,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createChallan,
  getChallans,
  getChallanById,
  confirmChallan,
  cancelChallan,
};
