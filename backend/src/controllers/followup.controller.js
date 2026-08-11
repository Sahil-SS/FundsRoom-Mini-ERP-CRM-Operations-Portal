const followUpService = require("../services/followup.service");

const createFollowUp = async (req, res, next) => {
  try {
    const followUp = await followUpService.createFollowUp(
      req.params.id,
      req.body,
      req.user.id,
    );

    return res.status(201).json({
      success: true,
      data: followUp,
    });
  } catch (error) {
    next(error);
  }
};

const getCustomerFollowUps = async (req, res, next) => {
  try {
    const followUps = await followUpService.getCustomerFollowUps(req.params.id);

    return res.status(200).json({
      success: true,
      data: followUps,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFollowUp,
  getCustomerFollowUps,
};
