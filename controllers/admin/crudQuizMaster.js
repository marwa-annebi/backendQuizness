const express = require("express");
const propositionModel = require("../../models/propositionModel");
const Question = require("../../models/questionModel");
const Quizmaster = require("../../models/users/quizmasterModel");

const createUser = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  const user = await Quizmaster.findOne({ email: req.body.email });
  if (user) return res.status(500).json({ msg: "email used" });

  const newUser = new Quizmaster({
    firstName,
    lastName,
    email,
    password,
    verified: true,
  });
  try {
    newUser.save().then(() => {
      res.status(201).send({
        message: " user saved",
        quizmaster_id: newUser._id,
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// read data

const getAllUsers = async (req, res) => {
  Quizmaster.find((error, result) => {
    if (error) {
      res.send(error);
    }
    res.status(200).send(result);
  });
};

//delete

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const questions = await Question.find({ quizmaster: req.params.id });
  console.log(questions);
  for (let index = 0; index < questions.length; index++) {
    const propositions = await propositionModel.deleteMany({
      _id: questions[index].propositions,
    });
    console.log(propositions);
  }
  await Question.deleteMany({ quizmaster: req.params.id });
  await Quizmaster.deleteOne({ _id: req.params.id })
    .then(res.send({ message: "Quizmaster was deleted successfully!" }))
    .catch((err) => {
      return res.status(500).send({
        message: "Could not delete Quizmaster",
      });
    });
};

// update

const updateUser = async (req, res) => {
  try {
    const updatedUser = await Quizmaster.findOneAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(400).json({ msg: error });
  }
};

//get single user

const getUserById = async (req, res) => {
  try {
    const user = await Quizmaster.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
