const expressAsyncHandler = require("express-async-handler");
const Quiz = require("./../../models/quizModel");
const moment = require("moment");

// create quiz

const createQuiz = async (req, res) => {
  const {
    creation_date,
    validation_date,
    questions,
    nbQuestion,
    duration,
    quizName,
  } = req.body;
  console.log({
    creation_date,
    validation_date,
    questions,
    nbQuestion,
    quizName,
  });
  await new Quiz({
    quizmaster: req.user._id,
    nbQuestion: nbQuestion,
    // quizmaster: id,
    quizName:
      "Quiz_" + ((await Quiz.find({ quizmaster: req.user._id }).count()) + 1),
    creation_date: moment(creation_date).format("MM-DD-yyyy"),
    validation_date: moment(validation_date).format("MM-DD-yyyy"),
    questions,
    duration,
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
    // populate("skill").
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions.",
      });
    });
});

module.exports = { createQuiz, deleteQuiz, findAllQuiz };
