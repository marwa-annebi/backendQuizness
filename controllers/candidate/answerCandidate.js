const expressAsyncHandler = require("express-async-handler");
const answerCandidatModel = require("../../models/answerCandidatModel");
const Voucher = require("../../models/voucherModel");
const Question = require("../../models/questionModel");
const Quiz = require("../../models/quizModel");
const Skill = require("../../models/skillModel");

const nbCorrectAnswer = async (propositions, req, res) => {
  try {
    let nb = 0;
    await propositions.map((item) => {
      if (item.veracity) nb++;
    });
    return nb;
  } catch (error) {
    res.status(500).send({ error });
  }
};

const correctAnswerController = expressAsyncHandler(async (req, res) => {
  try {
    let score = 0;
    let scoreFinal = 0;
    const { array, _id_voucher, nbQuestion } = req.body;
    const nb = Math.round(nbQuestion / 2);
    if (array.length > nb) {
      const newAnswer = new answerCandidatModel({
        voucher: _id_voucher,
        array,
      });
      newAnswer.save();
      let nbCorrectProposition = 0;
      let nbTotal = 0;
      let nbIncorrectProposition = 0;
      for (let index = 0; index < array.length; index++) {
        await Question.findOne({
          _id: { $in: array[index]._id_Question },
        })
          .populate("propositions")
          .then(async (result) => {
            nbTotal = result.propositions.length;
            nbCorrectProposition = await nbCorrectAnswer(result.propositions);
            nbIncorrectProposition = nbTotal - nbCorrectProposition;
            result.propositions.map(async (proposition) => {
              {
                array[index].answers.map((item) => {
                  if (item._id_proposition == proposition._id) {
                    if (item.response === proposition.veracity) {
                      score += 1 / nbCorrectProposition;
                    } else {
                      score -= 1 / nbIncorrectProposition;
                    }
                  }
                });
              }
            });
          });
      }
      scoreFinal = Math.round((score * 100) / nbQuestion);
      const filter = { _id: _id_voucher };
      const update = { score: scoreFinal };
      const voucher = await Voucher.findOneAndUpdate(filter, update)
        .populate("candidat")
        .populate({
          path: "quiz",
          model: Quiz,
          // select: "questions",
          populate: {
            path: "questions",
            model: Question,
            // select: "skill",
            populate: {
              path: "skill",
              model: Skill,
              // select: "skill_name",
            },
          },
        });
      res.status(200).send({ scoreFinal, voucher });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = {
  correctAnswerController,
};
