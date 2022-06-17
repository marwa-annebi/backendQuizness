// create question and proposition and create relation between them
const expressAsyncHandler = require("express-async-handler");
const Skill = require("../../models/skillModel");
const propositionModel = require("../../models/propositionModel");
const Question = require("../../models/questionModel");
const { createProposition } = require("./propositionController");
const Quizmaster = require("../../models/users/quizmasterModel");
const { addQuestion } = require("../../validation/questionValidation");

const finishQuestion = async (req, res) => {
  const {
    question: { skill, tronc, typeQuestion },
    proposition,
  } = req.body;

  const { error } = addQuestion({
    skill,
    tronc,
    // proposition,
  });
  if (error) return res.status(400).send({ message: error.message });
  // const troncExist = Question.findOne();
  // console.log(troncExist);
  // if (troncExist) {
  //   return res.status(400).send({ message: "Tronc exist" });
  // }
  questionCreated = await new Question({
    skill,
    tronc,
    typeQuestion,
    quizmaster: req.user._id,
    _id_question: "Q" + ((await Question.find({ skill }).count()) + 1),
  }).save();

  console.log(questionCreated);
  resultUpdateSkill = await Skill.findByIdAndUpdate(
    questionCreated.skill,
    {
      $push: { questions: questionCreated._id },
    },
    { new: true, useFindAndModify: false }
  );
  for (let index = 0; index < proposition.length; index++) {
    propositionCreated = await createProposition(
      proposition[index],
      questionCreated._id,
      questionCreated._id_question
    );
    resultUpdateQuestion = await Question.findByIdAndUpdate(
      questionCreated._id,
      { $push: { propositions: propositionCreated._id } },
      { new: true, useFindAndModify: false }
    );
  }
  if (!questionCreated || !propositionCreated) {
    res.send({ result: "false" });
  } else res.send({ result: "true" });
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
