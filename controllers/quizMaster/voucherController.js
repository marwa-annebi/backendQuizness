const voucherModel = require("./../../models/voucherModel");
const moment = require("moment");
var voucher_codes = require("voucher-code-generator");
const expressAsyncHandler = require("express-async-handler");
const { sendVoucherToCandidate } = require("../../mailer/mailer");
const Candidate = require("./../../models/users/candidateModel");
// create voucher
const createVoucher = async (req, res) => {
  let _id_voucher;
  try {
    const { creation_date, validation_date, quiz, candidat } = req.body;
    console.log({ creation_date, validation_date, quiz, candidat });
    const newVoucher = new voucherModel({
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

    Candidate.findById(candidat).then((result) => {
      console.log("result", result);
      newVoucher.save().then(() => {
        sendVoucherToCandidate(
          {
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            businessName: req.user.account.businessName,
            logo: req.user.account.logo,
            darkColor: req.user.account.darkColor,
            _id_voucher: newVoucher._id_voucher,
            validation_date: newVoucher.validation_date,
          },
          res
        );
      });
    });
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
  const { _id_voucher } = req.query;
  try {
    if (!_id_voucher) {
      return res.status(500).send({ message: "please enter your key" });
    } else {
      const start = new Date(Date.now());
      console.log(start);
      const data = await voucherModel.findOne({
        candidat: req.user._id,
        _id_voucher: _id_voucher,
      });
      console.log(data);
      if (data && start < data.validation_date) {
        console.log(data);
        res.json(data);
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

module.exports = {
  createVoucher,
  updateVoucher,
  getVoucherById,
  deleteVoucher,
  getVoucherByIdCandidat,
  getvoucher,
};
