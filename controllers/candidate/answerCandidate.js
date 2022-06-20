const expressAsyncHandler = require("express-async-handler");
const answer = require("../../models/answerCandidatModel");
const joi = require("@hapi/joi");
const answerCandidatModel = require("../../models/answerCandidatModel");
const Proposition = require("../../models/propositionModel");

const Voucher = require("../../models/voucherModel");
const Question = require("../../models/questionModel");
const propositionModel = require("../../models/propositionModel");

const answerValidation = (data) => {
  //   const schema = joi.object({
  //   voucher: joi.string().required(),
  //   proposition: joi.string().required(),
  //   response:joi.boolean().required()
  //   });
  //   return schema.validate(data);
};

const addAnswerController = expressAsyncHandler(async (req, res) => {
  try {
    // Validation
    // const { error } = answerValidation(req.body);
    // if (error) {
    //   return res.status(400).send(error.details[0].message);
    // }

    // save the result
    const result = new answerCandidatModel(req.body);
    const savedResult = await result.save();
    res.json(savedResult);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
const getAnswerController = async (id) => {
  try {
    const results = await answerCandidatModel.findById({ _id: id });
    return results;
  } catch (error) {
    throw new Error(error);
  }
};

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
    const { array, _id_voucher, nbQuestion, Tauxscore } = req.body;
    console.log(req.body);
    const nb = Math.round(nbQuestion / 2);
    if (array.length <= nb) {
      res.status(500).send({
        message: `please answer at least ${nb} questions`,
      });
    } else if (array.length > nb) {
      const newAnswer = new answerCandidatModel({
        _id_voucher,
        array,
      });
      newAnswer.save();
      let nbCorrectProposition = 0;
      let nbTotal = 0;
      let nbIncorrectProposition = 0;
      // let nbTotalQuestion = 0;
      const result = [];
      for (let index = 0; index < array.length; index++) {
        await Question.findOne({
          _id: { $in: array[index]._id_Question },
        })
          .populate("propositions")
          .then(async (result) => {
            nbTotal = result.propositions.length;
            console.log(nbTotal);
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
      scoreFinal = (score * 100) / nbQuestion;
      const updateVoucher = await Voucher.findOneAndUpdate(
        { _id: _id_voucher },
        { $set: { score: scoreFinal } },
        { new: true }
      );
      console.log(updateVoucher);
      res.send({ scoreFinal });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = {
  answerValidation,
  addAnswerController,
  getAnswerController,
  correctAnswerController,
};
