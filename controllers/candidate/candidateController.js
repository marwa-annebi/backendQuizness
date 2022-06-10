const expressAsyncHandler = require("express-async-handler");
const Question = require("../../models/questionModel");
const Skill = require("../../models/skillModel");
const voucherModel = require("./../../models/voucherModel");
const Quiz = require("./../../models/quizModel");
const propositionModel = require("../../models/propositionModel");

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

const findAllQuiz = expressAsyncHandler(async (req, res) => {
  let quizmaster = req.query.quizmaster; // const question = { quizmaster: quizmaster };
  let { page, pageSize } = req.query;
  Quiz.find({ quizmaster })
    .populate({
      path: "questions",
      model: Question,
      match: { isDeleted: false },
      populate: {
        path: "propositions",
        model: Proposition,
      },
    })
    // .limit(pageSize)
    // .skip((page - 1) * pageSize)
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
const findQuizById = expressAsyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    let id = req.params.id;

    const perPage = req.query.perPage || 1;
    const count = await Quiz.findById(id, { _id: 0, questions: 1 });
    const countQuestion = count.questions.length;
    console.log(countQuestion);
    Quiz.findById(id, { _id: 0, questions: 1 }).then((data) => {
      Question.find({
        _id: { $in: data.questions },
      })
        .populate("propositions")
        .skip((page - 1) * parseInt(perPage))
        .limit(parseInt(perPage))
        .then((result) => {
          console.log({ result, countQuestion }),
            res.status(200).json({ result, countQuestion });
        });
    });

    // questions

    //   .then((data) => res.status(200).send({ data, countQuestion }));
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving questions.",
    });
  }
});

module.exports = { getQuizByIdVoucher, getSkills, findAllQuiz, findQuizById };
