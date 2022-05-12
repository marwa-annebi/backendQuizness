// create question and proposition and create relation between them
const expressAsyncHandler = require("express-async-handler");
const req = require("express/lib/request");
const { default: mongoose } = require("mongoose");
const Category = require("../../models/categoryModel");
const propositionModel = require("../../models/propositionModel");
const Question = require("../../models/questionModel");
const verifToken = require("../../utils/verifyToken");
const { createProposition } = require("./propositionController");
const { createQuestion } = require("./questionController");

const finishQuestion = async (req, res) => {
  const {
    question: { category, tronc, typeQuestion },
    proposition,
  } = req.body;
  // quizmaster = req.user._id;
  // console.log(quizmaster);
  questionCreated = await new Question({
    category,
    tronc,
    typeQuestion,
    quizmaster :req.user._id
  }).save()
  console.log(questionCreated);
  resultUpdateCategory = await Category.findByIdAndUpdate(
    questionCreated.category,
    {
      $push: { questions: questionCreated._id },
    },
    { new: true, useFindAndModify: false }
  );
  console.log(resultUpdateCategory);
  //   questionCreated._id = new mongoose.Types.ObjectId();

  for (let index = 0; index < proposition.length; index++) {
    propositionCreated = await createProposition(proposition[index]);
    resultUpdateQuestion = await Question.findByIdAndUpdate(
      questionCreated._id,
      { $push: { propositions: propositionCreated._id } },
      { new: true, useFindAndModify: false }
    );
    console.log(resultUpdateQuestion);
    resultUpdateProposition = await propositionModel.findByIdAndUpdate(
      propositionCreated._id,
      { question: questionCreated._id },
      { new: true, useFindAndModify: false }
    );
  }
  if (!questionCreated || !propositionCreated) {
    res.send({ result: "false" });
  } else res.send({ result: "true" });
  // console.log(questionCreated);
  // console.log(propositionCreated);
};

const nbofProposition = expressAsyncHandler(async (req, res) => {
  let nb = 0;
  const { id_question } = req.body;
  const proposition = await propositionModel.find({ question: id_question });
  console.log(proposition);
  for (let index = 0; index < proposition.length; index++) {
    nb = nb + 1;
  }
  res.json({
    nb,
    proposition,
  });
});

module.exports = { finishQuestion, nbofProposition };
