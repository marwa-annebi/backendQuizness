const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const CandidateSkill = require("../../models/CanidateSkill");

const findAllCandidateSkill = expressAsyncHandler(async (req, res) => {
  console.log("helooo");
  await CandidateSkill.find({ _id_quizmaster: req.user._id })
    .populate("userId")
    .populate("_id_skill")
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions.",
      });
    });
});

module.exports = { findAllCandidateSkill };
