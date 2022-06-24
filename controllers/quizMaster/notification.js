const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Quizmaster = require("../../models/users/quizmasterModel");

const getNotifications = expressAsyncHandler(async (req, res) => {
  const notifications = await Quizmaster.findById({ _id: req.user._id });
  res.json(notifications);
});

const deleteNotificaton = async (req, res) => {
  const { id } = req.params;
  await Quizmaster.updateOne(
    { _id: req.user._id },
    {
      $pullAll: {
        notifications: [req.params.id],
      },
    }
    // { new: true }
  );
};
module.exports = { getNotifications, deleteNotificaton };
