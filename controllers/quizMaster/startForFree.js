const expressAsyncHandler = require("express-async-handler");
const express = require("express");
const User = require("../../models/users/userModel");


const testIfTrial= async (req,res)=>{
 const {email}=req.body
 user = await User.findOne({
    email,
    isQuizmaster: true,
    
  });


}
module.exports={testIfTrial}