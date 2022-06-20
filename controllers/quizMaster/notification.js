const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Quizmaster = require("../../models/users/quizmasterModel");

const getNotifications = expressAsyncHandler(async (req, res) => {
  const notifications = await Quizmaster.findById({ _id: req.user._id });
  res.json(notifications);
});
module.exports = getNotifications;
