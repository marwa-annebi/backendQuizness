const express = require("express");
const propositionModel = require("../../models/propositionModel");
const Question = require("../../models/questionModel");
const Quizmaster = require("../../models/users/quizmasterModel");
const Candidat = require("../../models/users/candidateModel");
const Quiz =require("../../models/quizModel")

const nbUserEachMonth = async (req, res) => {
  let array = [
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
  ];
  let array2 = [];

  var today = new Date();
  try {
    await Quizmaster.aggregate([
      ({
        $match: {
          createdAt: {
            $lt: today.toISOString(),
          },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          total: {
            $sum: 1,
          },
        },
      }),
    ]).exec(function (err, result) {
      console.log(result);
      // if (err) return handleError(err);
      console.log("hello");
      array.map((index, key) => {
        for (let index = 0; index < result.length; index++) {
          // let id2 = result[index]._id;
          if (key == result[index]._id) {
            var element = result[index];
            // element += array[id2 - 1];
            array[result[index]._id - 1] = element;
          } else {
            console.log("falseee");
          }
        }
      });
      return res.status(200).send(array);
    });

    // console.log(nb);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const nbCandidatEachMonth = async (req, res) => {
  let array = [
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
  ];
  let array2 = [];

  var today = new Date();
  try {
    await Candidat.aggregate([
      ({
        $match: {
          createdAt: {
            $lt: today.toISOString(),
          },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          total: {
            $sum: 1,
          },
        },
      }),
    ]).exec(function (err, result) {
      console.log(result);
      // if (err) return handleError(err);
      console.log("hello");
      array.map((index, key) => {
        for (let index = 0; index < result.length; index++) {
          // let id2 = result[index]._id;
          if (key == result[index]._id) {
            var element = result[index];
            // element += array[id2 - 1];
            array[result[index]._id - 1] = element;
          } else {
            console.log("falseee");
          }
        }
      });
      return res.status(200).send(array);
    });

    // console.log(nb);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const nbQuizEachMonth = async (req, res) => {
  let array = [
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
    { month: {}, total: 0 },
  ];
  let array2 = [];

  var today = new Date();
  try {
    await Quiz.aggregate([
      ({
        $match: {
          createdAt: {
            $lt: today.toISOString(),
          },
        },
      },
      {
        $project: {
          month: {
            $month: "$createdAt",
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          total: {
            $sum: 1,
          },
        },
      }),
    ]).exec(function (err, result) {
      console.log(result);
      // if (err) return handleError(err);
      console.log("hello");
      array.map((index, key) => {
        for (let index = 0; index < result.length; index++) {
          // let id2 = result[index]._id;
          if (key == result[index]._id) {
            var element = result[index];
            // element += array[id2 - 1];
            array[result[index]._id - 1] = element;
          } else {
            console.log("falseee");
          }
        }
      });
      return res.status(200).send(array);
    });

    // console.log(nb);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};
const createUser = async (req, res) => {
  let {
    firstName,
    lastName,
    email,
    password,
    account: { domain_name, logo, lightColor, darkColor, businessName },
  } = req.body;

  const user = await Quizmaster.findOne({
    email: req.body.email,
    domain_name: req.body.domain_name,
  });
  if (user)
    return res.status(500).json({ message: "email  or domain_name exist" });

  const newUser = new Quizmaster({
    firstName,
    lastName,
    email,
    password,
    verified: true,
    account: {
      domain_name,
      businessName,
      darkColor,
      lightColor,
      logo,
    },
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
  // const {
  //   account: { domain_name, logo, darkColor, lightColor, businessName },
  //   firstName,
  //   lastName,
  //   email,
  // } = req.body;
  try {
    console.log("body", req.body);
    const updatedUser = await Quizmaster.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    console.log("updated", updatedUser);
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
  nbUserEachMonth,
  nbCandidatEachMonth,
  nbQuizEachMonth,
};
