const voucherModel = require("./../../models/voucherModel");
const moment = require("moment");
var voucher_codes = require("voucher-code-generator");
const expressAsyncHandler = require("express-async-handler");
const { sendVoucherToCandidate } = require("../../mailer/mailer");
const Candidate = require("./../../models/users/candidateModel");
const Quiz = require("../../models/quizModel");
const CandidateSkill = require("../../models/CanidateSkill");
// create voucher
const createVoucher = async (req, res) => {
  try {
    const { creation_date, validation_date, quiz, candidat } = req.body;
    if (!quiz || !validation_date || !creation_date) {
      res.status(400).send({ message: "required" });
    } else if (creation_date > validation_date) {
      res
        .status(400)
        .send({ message: "creation date must be < to validation date" });
    } else {
      const newVoucher = await new voucherModel({
        creation_date: moment(creation_date).format("yyyy-MM-DD"),
        validation_date: moment(validation_date).format("yyyy-MM-DD"),
        quiz,
        candidat,
        _id_voucher: voucher_codes
          .generate({
            prefix: "Quizness-",
          })
          .toString(),
      });

      Candidate.findById(candidat).then(async (result) => {
        // console.log("result", result);
        newVoucher.save().then(() => {
          sendVoucherToCandidate({
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            businessName: req.user.account.businessName,
            logo: req.user.account.logo,
            darkColor: req.user.account.darkColor,
            _id_voucher: newVoucher._id_voucher,
            validation_date: newVoucher.validation_date,
          });
        });
        var myquery = { userId: result._id };
        await CandidateSkill.deleteOne(myquery);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// update Voucher

const updateVoucher = expressAsyncHandler(async (req, res) => {
  try {
    const updateVoucher = await voucherModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.status(200).send({
      message: "update successfully",
      updateVoucher,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// getVoucherByIdCandidat
const getVoucherByIdCandidat = expressAsyncHandler(async (req, res) => {
  try {
    let { id } = req.params;
    vouchers = await voucherModel.find({ "vouchers.candidat": id });
    res.json(vouchers);
  } catch (error) {
    res.status(500).send(error);
  }
});

//

const getvoucher = expressAsyncHandler(async (req, res) => {
  const { _id_voucher } = req.body;
  try {
    if (!_id_voucher) {
      return res.status(500).send({ message: "please enter your key" });
    } else {
      const start = new Date(Date.now());
      const data = await voucherModel.findOne({
        _id_voucher: _id_voucher,
        // candidat: req.user._id,
      });
      // .populate("quiz");
      console.log(data);
      const result = await Quiz.findById({ _id: data.quiz });

      const nbQuestion = result.nbQuestion;
      const Tauxscore = result.Tauxscore;

      console.log(result);
      if (data && start < data.validation_date) {
        console.log(data);
        res.json({ data, nbQuestion, Tauxscore });
      } else if (data && start > data.validation_date) {
        res.status(500).send({ message: "Invalid Key" });
      } else if (!data) {
        res.status(500).send({ message: "Incorrect Key " });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//getVoucherByid
const getVoucherById = expressAsyncHandler(async (req, res) => {
  voucher = await voucherModel.findById(req.params.id);
  if (voucher) {
    res.json(voucher);
  } else {
    res.status(404).json({ message: "voucher  not found" });
  }
});

//delete voucher
const deleteVoucher = expressAsyncHandler(async (req, res) => {
  const voucher = await voucherModel.findById(req.params.id);
  if (voucher) {
    await voucher.remove();
    res.json({ message: "voucher Removed" });
  } else {
    res.status(404);
    res.json({ message: "voucher  not Found" });
  }
});

const findAllVoucher = expressAsyncHandler(async (req, res) => {
  var array = [];
  var array1 = [];
  const vouchers = await voucherModel
    .find()
    .populate("candidat")
    .then((result) => {
      // for (let index = 0; index < result.length; index++) {
      //   const quizmasters = result[index].candidat.quizmaster;
      //   console.log(quizmasters);
      //   for (let index = 0; index < quizmasters.length; index++) {
      //     const element = quizmasters[index];
      //     if (element == req.user._id) {
      //       return res.send(result);
      //     }
      //   }
      // }
      {
        result.map((voucher) => {
          const quizmasters = voucher.candidat.quizmaster;
          console.log(quizmasters);
          quizmasters.map((quizmater) => {
            console.log(quizmater);
            if (quizmater.toString() == req.user._id.toString()) {
              array.push(voucher);
            }
          });
        });
      }
    });
  {
    array.map((key) => {
      if (key.status === "success") {
        array1.push(key);
      }
    });
  }
  res.status(200).send(array1);
});

module.exports = {
  createVoucher,
  updateVoucher,
  getVoucherById,
  deleteVoucher,
  getVoucherByIdCandidat,
  getvoucher,
  findAllVoucher,
};
