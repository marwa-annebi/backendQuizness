const expressAsyncHandler = require("express-async-handler");
const Question = require("./../../models/questionModel");

const createQuestion = function (category, tronc, typeQuestion) {
  // console.log(question);
  // add control
  // const {category,typeQuestion,propositions,tronc}=req.body
  return Question.create(category, tronc, typeQuestion).then((docquestion) => {
    // console.log(docquestion);
    return docquestion;
  });
};

const deleteQuestion = expressAsyncHandler(async (req, res) => {
  // const id = req.params.id;
  await Question.deleteOne({ _id: req.params.id })
    .then(res.send({ message: "Question was deleted successfully!" }))
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Question ",
      });
    });
});

const findAll = expressAsyncHandler(async (req, res) => {
  // Question.find({ quizmaster: req.quizmaster._id })
  Question.find({ quizmaster: req.user._id })
    .populate("propositions")
    .populate("category")
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

module.exports = {
  createQuestion,
  deleteQuestion,
  findAll,
};
