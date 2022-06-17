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
    const { array, _id_voucher } = req.body;
    const newAnswer = new answerCandidatModel({
      array,
    });
    newAnswer.save();
    let nbCorrectProposition = 0;
    let nbTotal = 0;
    let nbIncorrectProposition = 0;
    const result = [];
    let scoreFinal = 0;
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      // console.log(element);
      await Question.findOne({
        _id: { $in: array[index]._id_Question },
      })
        .populate("propositions")
        .then(async (result) => {
          nbTotal = result.propositions.length;
          // console.log(nbTotal);
          nbCorrectProposition = await nbCorrectAnswer(result.propositions);
          nbIncorrectProposition = nbTotal - nbCorrectProposition;
          result.propositions.map(async (proposition) => {
            // console.log(nbIncorrectProposition);
            {
              array[index].answers.map((item) => {
                if (item._id_proposition == proposition._id) {
                  // console.log(score);
                  if (item.response === proposition.veracity) {
                    score += 1 / nbCorrectProposition;
                    console.log("bonne reponse", score);
                  } else {
                    score -= 1 / nbIncorrectProposition;
                    console.log(nbIncorrectProposition);
                    console.log(1 / nbIncorrectProposition);
                    console.log("mauvaise reponse", score);
                  }
                }
              });
            }
          });
        });
    }
    res.send({ score });
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
