
const voucherModel= require("./../../models/voucherModel");
const moment = require("moment");
var voucher_codes = require('voucher-code-generator');
const expressAsyncHandler = require("express-async-handler");

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

// update Voucher 
const updateVoucher = expressAsyncHandler(async(req,res)=>{
try {


  const updateVoucher=  await voucherModel.findByIdAndUpdate(
    req.params.id,
    {...req.body},
    {new:true}
  );
  res.status(200).send({
    message:"update successfully",
    updateVoucher
  })
}

catch (error ){
res.status(500).send(error)
}

});
// getVoucherByIdCandidat
const getVoucherByIdCandidat =expressAsyncHandler(async(req,res)=>{
  try
   { 
     let {id}=req.params;
    vouchers= await voucherModel.find({'vouchers.candidat':id})
    res.json(vouchers);}
    catch (error){
  res.status(500).send(error)
    }
  }
  );





//getVoucherByid
const getVoucherById =expressAsyncHandler(
  async(req,res)=>{
    voucher= await voucherModel.findById(req.params.id)
    if (voucher)
    {
    res.json(voucher);
    }
   else {
    res.status(404).json({ message: "voucher  not found" });}
  }
      );
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
      


module.exports={ createVoucher,updateVoucher,getVoucherById,deleteVoucher ,getVoucherByIdCandidat}