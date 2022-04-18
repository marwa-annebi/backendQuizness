
const voucherModel= require("./../../models/voucherModel");
const moment = require("moment");
var voucher_codes = require('voucher-code-generator');

// create voucher 
const createVoucher= async(req,res)=>{
   let _id_voucher;
    try{
    
    const {creation_date,validation_date,quiz,candidat}=req.body;
    const newVoucher = new voucherModel({
    creation_date:moment(creation_date).format("yyyy-MM-DD"),
    validation_date:moment(validation_date).format("yyyy-MM-DD"),
    quiz,
    candidat,
    _id_voucher:(voucher_codes.generate({
        prefix: "Quizness-",
        
    })).toString()
})
newVoucher.save().then(() => {
  return    res.json({
      status: "SUCCESS",
      message: "voucher  saved",
      _id_voucher

    });
  });
}
catch (error) {
   console.log(error);
  };
}




module.exports={ createVoucher}