const expressAsyncHandler = require("express-async-handler");
const Question = require("../../models/questionModel");
const Skill = require("../../models/skillModel");
const voucherModel = require("./../../models/voucherModel");

const getQuizByIdVoucher = expressAsyncHandler(async (req, res) => {
  const { _id_voucher } = req.body;
  voucherModel
    .find({ _id_voucher })
    .populate("quiz")
    .then(async (data) => {
      getQuestions(data[0].quiz.questions, res);
      // res.status(200).send(result);
      //   res.send(data[0].quiz);
      // console.log(quiz);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
});
const getQuestions = expressAsyncHandler(async (questions, res) => {
  var array = [];
  for (let index = 0; index < questions.length; index++) {
    result = await Question.findById(questions[index]).populate("propositions");
    array.push(result);
  }
  //   console.log(array);
  //   return array;
  return res.send(array);
});

const getSkills = expressAsyncHandler(async (req, res) => {
  console.log("helloooooooo");
  // const { quizmaster } = req.body;
  let quizmaster = req.query.quizmaster; // const question = { quizmaster: quizmaster };
  const skills = await Skill.find({
    quizmaster,
  });
  res.status(200).send(skills);
});

module.exports = { getQuizByIdVoucher, getSkills };
