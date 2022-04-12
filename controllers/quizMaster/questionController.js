const expressAsyncHandler = require("express-async-handler");
const Question = require("./../../models/questionModel");

const createQuestion = function (question) {
  // console.log(question);
  // add control

  return Question.create(question).then((docquestion) => {
    // console.log(docquestion);
    return docquestion;
  });
};

const deleteQuestion = expressAsyncHandler(async (req, res) => {
  try {
    const deleted = await Question.deleteOne({ _id: req.params.id });
  } catch (e) {
    console.error(`[error] ${e}`);
    throw Error("Error occurred while deleting Question");
  }
});

const findAll = expressAsyncHandler(async (req, res) => {
  const questions = await Question.findAll({
    include: ["propositions"],
  }).then(() => {
    return questions;
  });
});

module.exports = {
  createQuestion,
  deleteQuestion,
  findAll
};
