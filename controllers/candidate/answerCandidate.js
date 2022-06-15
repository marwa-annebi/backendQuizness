const expressAsyncHandler = require("express-async-handler");
const answer = require("../../models/answerCandidatModel");
const joi = require("@hapi/joi");
const answerCandidatModel = require("../../models/answerCandidatModel");
const Proposition = require("../../models/propositionModel");

const Voucher = require("../../models/voucherModel");

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
const correctAnswerController = expressAsyncHandler(async (req, res) => {
  let score = 0;
  try {
    const { id_answer, id_proposition } = req.body;
    const proposition = await Proposition.findById({ _id: id_proposition });
    const answerCandidate = await getAnswerController(id_answer);
    const voucher = answerCandidate.voucher;
    console.log(voucher);

    if (proposition && answerCandidate) {
      if (answerCandidate.response == proposition.veracity) {
        score = score + 1;
        console.log(score);

        const updateVoucher = await Voucher.findOneAndUpdate(
          { _id: voucher },
          { $set: { score: score } },
          { new: true }
        );
        console.log(updateVoucher);

        res.json({
          updateVoucher,
        });
      } else {
        res.json({
          message: "reponse incorrect ",
        });
      }
    }

    if (!proposition) {
      res.status(404).json({
        message: "proposition doesn't exist",
      });
    }
    if (!answerCandidate) {
      res.status(404).json({
        message: "answer doesn't exist",
      });
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
