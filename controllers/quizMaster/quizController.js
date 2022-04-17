const expressAsyncHandler = require("express-async-handler");
const Quiz = require("./../../models/quizModel");
const moment = require("moment");

// create quiz

const createQuiz = async (req, res) => {
  // return Quiz.create(quiz).then((docquiz) => {
  //     console.log("\n>> Created Tutorial:\n", docquiz);
  //   return docquestion;
  // });
  const { quizmaster, creation_date, validation_date, questions } = req.body;
await new Quiz({
    quizmaster,
    creation_date: moment(creation_date).format("yyyy-MM-DD"),
    validation_date: moment(validation_date).format("yyyy-MM-DD"),
    questions,
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
      res.sendStatus(201);
    })
    .catch(() => {
      res.sendStatus(500)
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

const updateQuiz = expressAsyncHandler(async(req,res)=>{

})

//find all
const findAllQuiz = expressAsyncHandler(async (req, res) => {
  // Quiz.find({ quizmaster: req.quizmaster._id })
  Quiz.find({ quizmaster: req.body.quizmaster })
    .populate("questions")
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
