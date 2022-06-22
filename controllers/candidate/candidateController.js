const expressAsyncHandler = require("express-async-handler");
const Question = require("../../models/questionModel");
const Skill = require("../../models/skillModel");
const voucherModel = require("./../../models/voucherModel");
const Quiz = require("./../../models/quizModel");

const getQuizByIdVoucher = expressAsyncHandler(async (req, res) => {
  const { _id_voucher } = req.query._id_voucher;
  voucherModel
    .find({ _id_voucher })
    .populate("quiz")
    .then(async (data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
});

const getSkills = expressAsyncHandler(async (req, res) => {
  let quizmaster = req.query.quizmaster;
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
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions.",
      });
    });
});

// get quiz by id voucher

const findQuizById = expressAsyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const perPage = req.query.perPage || 1;
    let { id } = req.params;
    let { _id_voucher } = req.params;
    const resultVoucher = await voucherModel.findOne({
      _id: _id_voucher,
      quiz: id,
    });
    const quiz = await Quiz.findById(id);
    const countQuestion = quiz.questions.length;
    if (resultVoucher.startTime === null) {
      resultVoucher.startTime = new Date().setHours(new Date().getHours() + 1);
      resultVoucher.save();
      const timer = (await quiz.duration) * 60000;

      Quiz.findById(id, { _id: 0, questions: 1 }).then((data) => {
        Question.find({
          _id: { $in: data.questions },
        })
          .populate("propositions")
          .skip((page - 1) * parseInt(perPage))
          .limit(parseInt(perPage))
          .then((result) => {
            res.status(200).json({ result, countQuestion, timer });
          });
      });
    } else {
      let resuult = resultVoucher.startTime;
      await resuult.setMinutes(resuult.getMinutes() + quiz.duration);
      if (resuult < new Date()) {
        voucherModel.remove(resultVoucher);
        res.status(403).json({ message: "date of voucher expired" });
      } else {
        const timer =
          resuult.getTime() - new Date().setHours(new Date().getHours() + 1);
        Quiz.findById(id, { _id: 0, questions: 1 }).then((data) => {
          Question.find({
            _id: { $in: data.questions },
          })
            .populate("propositions")
            .skip((page - 1) * parseInt(perPage))
            .limit(parseInt(perPage))
            .then((result) => {
              res.status(200).json({ result, countQuestion, timer });
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
