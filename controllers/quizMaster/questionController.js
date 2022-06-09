const expressAsyncHandler = require("express-async-handler");
const Question = require("./../../models/questionModel");

const createQuestion = function (skill, tronc, typeQuestion) {
  // console.log(question);
  // add control
  // const {category,typeQuestion,propositions,tronc}=req.body
  return Question.create(skill, tronc, typeQuestion).then((docquestion) => {
    // console.log(docquestion);
    return docquestion;
  });
};

const deleteQuestion = expressAsyncHandler(async (req, res) => {
  // const id = req.params.id;
  console.log(req.params._id);
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
    .populate("skill")
    .then((data) => {
      res.status(200).send(data);
      console.log(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions.",
      });
    });
});
const updateQuestion = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  Question.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update Question. Maybe Question was not found!`,
        });
      } else res.send({ message: "Question  was updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Question with ",
      });
    });
});

module.exports = {
  createQuestion,
  deleteQuestion,
  updateQuestion,
  findAll,
};
