const expressAsyncHandler = require("express-async-handler");
const Quiz = require("./../../models/quizModel");
const moment = require("moment");
const Question = require("../../models/questionModel");
const { quizAdd } = require("../../validation/quizValidation");

// create quiz

const createQuiz = async (req, res) => {
  const {
    creation_date,
    validation_date,
    questions,
    nbQuestion,
    duration,
    quizName,
    Tauxscore,
    typeQuiz,
  } = req.body;
  const { error } = quizAdd({
    quizName,
    nbQuestion,
    duration,
    Tauxscore,
    creation_date,
    validation_date,
  });

  if (error) return res.status(400).send({ message: error.message });
  else if (creation_date > validation_date) {
    res
      .status(400)
      .send({ message: "creation date must be < to validation date" });
  }
  await new Quiz({
    quizmaster: req.user._id,
    nbQuestion: nbQuestion,
    // quizmaster: id,
    quizName: "Quiz_" + quizName,
    creation_date: moment(creation_date).format("MM-DD-yyyy"),
    validation_date: moment(validation_date).format("MM-DD-yyyy"),
    questions,
    duration,
    typeQuiz,
    Tauxscore: Tauxscore,
  })
    .save()
    .then((data) => {
      for (let index = 0; index < questions.length; index++) {
        Quiz.findByIdAndUpdate(
          data._id,
          {
            $push: { questions: questions[index]._id },
          },
          { new: true, useFindAndModify: false }
        );
      }
      res.status(201).send({ message: "quiz created" });
    })
    .catch((error) => {
      res.status(500).send(error);
      console.log(error);
    });
};

// delete quiz

const deleteQuiz = expressAsyncHandler(async (req, res) => {
  // const id = req.params.id;
  await Quiz.deleteOne({ _id: req.params.id })
    .then(res.send({ message: "Quiz was deleted successfully!" }))
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Quiz ",
      });
    });
});

//update quiz

const updateQuiz = expressAsyncHandler(async (req, res) => {});

//find all
const findAllQuiz = expressAsyncHandler(async (req, res) => {
  Quiz.find({ quizmaster: req.user._id })
    .populate("questions")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions.",
      });
    });
});

module.exports = { createQuiz, deleteQuiz, findAllQuiz };
