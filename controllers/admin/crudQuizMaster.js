const express = require("express");
const User = require("../../models/users/userModel");

const createUser = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
    isQuizmaster:true
  });
  try {
    newUser.save().then((result) => {
      newUser._id;
    });
  } catch (error) {
    console.error(error);
  }
};

// read data

const getAllUsers = async (req, res) => {
   User.find({isQuizmaster:true}, (error, result) => {
    if (error) {
      res.send(error);
    }
    res.status(200).send(result);
  });
};

//delete

const deleteUser = async (req, res) => {
const {id}=req.params
let user = await User.findOne({id,isQuizmaster:true,isCandidat:false});

console.log(user);
if (!user){
  user=await User.findOne({id,isQuizmaster:true,isCandidat:true})
  await  user.updateOne({isQuizmaster:false});
  return  res.json({ message: "quizmaster Removed" });
  
}
  if (user) {
      
    await user.remove();
    res.json({ message: "user Removed" });
  } else {
    res.status(404);
    res.json({ message: "user not Found" });
  }
};

// update

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.send(updatedUser);
  } catch (error) {
    console.error(error);
  }
};

//get single user

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
};
