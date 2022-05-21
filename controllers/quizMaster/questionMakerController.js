// create question and proposition and create relation between them
const expressAsyncHandler = require("express-async-handler");
const Skill = require("../../models/skillModel");
const propositionModel = require("../../models/propositionModel");
const Question = require("../../models/questionModel");
const { createProposition } = require("./propositionController");
const Quizmaster = require("../../models/users/quizmasterModel");

const finishQuestion = async (req, res) => {
  const {
    question: { quizmaster, skill, tronc, typeQuestion },
    proposition,
  } = req.body;
  questionCreated = await new Question({
    skill,
    tronc,
    typeQuestion,

    quizmaster,
    _id_question: "Q" + ((await Question.count({ quizmaster })) + 1),
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
