// create question and proposition and create relation between them

const req = require("express/lib/request");
const { default: mongoose } = require("mongoose");
const Category = require("../../models/categoryModel");
const propositionModel = require("../../models/propositionModel");
const Question = require("../../models/questionModel");
const { createProposition } = require("./propositionController");
const { createQuestion } = require("./questionController");

const finishQuestion = async (req, res) => {
  const { question, proposition } = req.body;
  questionCreated = await createQuestion(question);
  console.log(questionCreated);
  resultUpdateCategory = await Category.findByIdAndUpdate(
    questionCreated.category,
    {
      $push: { questions: questionCreated._id },
    },
    { new: true, useFindAndModify: false }
  );
  //   questionCreated._id = new mongoose.Types.ObjectId();

  for (let index = 0; index < proposition.length; index++) {
    propositionCreated = await createProposition(proposition[index]);
    resultUpdateQuestion = await Question.findByIdAndUpdate(
      questionCreated._id,
      { $push: { propositions: propositionCreated._id } },
      { new: true, useFindAndModify: false }
    );
    resultUpdateProposition = await propositionModel.findByIdAndUpdate(
      propositionCreated._id,
      { question: questionCreated._id },
      { new: true, useFindAndModify: false }
    );
  }
if(!questionCreated || !propositionCreated ){
    res.send({result:'false'})
}
else res.send({result:'true'})
  // console.log(questionCreated);
  // console.log(propositionCreated);
};

module.exports = { finishQuestion };
