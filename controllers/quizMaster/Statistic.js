const express = require("express");
const Quiz = require("../../models/quizModel");
const Candidate = require("../../models/users/candidateModel");
const nbQuizTotal = async (req, res) => {
  let nbQuizRandomize = 0;
  let nbQuizBySelection = 0;

  const quiz = await Quiz.find({ quizmaster: req.user._id });
  // console.log(quiz)
  console.log(quiz);
  if (quiz) {
    for (let index = 0; index < quiz.length; index++) {
      if (quiz[index].typeQuiz == "selection") {
        nbQuizBySelection++;
        // console.log(nbQuizBySelection);
      } else {
        nbQuizRandomize++;
      }
    }
    res.status(200).send({
      nbQuizBySelection,
      nbQuizRandomize,
    });
  }
  if (!quiz) {
    res.status(400).send({ message: " quiz doesn't exist" });
  }
};
const nbcandidatByeachMonth = async (req, res) => {
  const { id } = req.body;
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

  var today = new Date();

  try {
    // Candidate.findOne({})
    const quizmaster = await Candidate.find({ quizmaster: { $in: [id] } });
    console.log(quizmaster);
    if (quizmaster) {
      await Candidate.aggregate([
        ({
          $match: {
            quizmaster: { $in: [id] },
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
        // console.log("hello");
        array.map((index, key) => {
          for (let index = 0; index < result.length; index++) {
            // let id2 = result[index]._id;
            if (key == result[index]._id) {
              var element = result[index];
              // element += array[id2 - 1];
              array[result[index]._id - 1] = element;
            } else {
              // console.log("falseee");
            }
          }
        });
        return res.status(200).send(array);
      });
    }

    // console.log(nb);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = { nbQuizTotal, nbcandidatByeachMonth };
