const expressAsyncHandler = require("express-async-handler");
const Question = require("../../models/questionModel");
const Skill = require("../../models/skillModel");
const voucherModel = require("./../../models/voucherModel");
const Quiz = require("./../../models/quizModel");
const propositionModel = require("../../models/propositionModel");
const dayjs = require("dayjs");
const getQuizByIdVoucher = expressAsyncHandler(async (req, res) => {
  const { _id_voucher } = req.query._id_voucher;
  console.log(_id_voucher);
  voucherModel
    .find({ _id_voucher })
    .populate("quiz")
    .then(async (data) => {
      // getQuestions(data[0].quiz.questions, res);
      // res.status(200).send(result);
      res.send({ data });
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
  // console.log("helloooooooo");
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
    const perPage = req.query.perPage || 1;
    let id = req.params.id;
    const resultVoucher = await voucherModel.findOne({ quiz: id });
    const quiz = await Quiz.findById(id);
    const countQuestion = quiz.questions.length;
    if (resultVoucher.startTime === null) {
      resultVoucher.startTime = dayjs().format();
      resultVoucher.save();
      const minutes = quiz.duration;
      const seconds = 00;
      Quiz.findById(id, { _id: 0, questions: 1 }).then((data) => {
        Question.find({
          _id: { $in: data.questions },
        })
          .populate("propositions")
          .skip((page - 1) * parseInt(perPage))
          .limit(parseInt(perPage))
          .then((result) => {
            // console.log({ result }),
            res.status(200).json({ result, countQuestion, minutes, seconds });
          });
      });
    } else {
      let resuult = resultVoucher.startTime;
      // console.log(resuult);
      // console.log(new Date());
      // console.log(Date.now());
      await resuult.setMinutes(resuult.getMinutes() + quiz.duration);
      console.log(resuult);

      if (resuult < new Date()) {
        res.status(403).json({ message: "date of voucher expired" });
      } else {
        const minutes = resuult.getMinutes() - new Date().getMinutes();
        const seconds = resuult.getSeconds() - new Date().getSeconds();

        Quiz.findById(id, { _id: 0, questions: 1 }).then((data) => {
          Question.find({
            _id: { $in: data.questions },
          })
            .populate("propositions")
            .skip((page - 1) * parseInt(perPage))
            .limit(parseInt(perPage))
            .then((result) => {
              // console.log({ result, countQuestion }),

              res.status(200).json({ result, countQuestion, minutes, seconds });
            });
        });
      }
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving questions.",
    });
  }
});

module.exports = { getQuizByIdVoucher, getSkills, findAllQuiz, findQuizById };
