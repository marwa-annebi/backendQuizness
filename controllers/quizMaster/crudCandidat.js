const express = require("express");
const Candidate = require("../../models/users/candidateModel");
const createCandidat = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      // confirmpassword,
      quizmaster,
    } = req.body;
    // console.log(req.body);
    // const { error } = registerValidation({
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    //   confirmpassword,
    // });
    // if (error) return res.status(400).send({ message: error.message });
    const newUser = await new Candidate({
      firstName,
      lastName,
      email,
      password,
      quizmaster,
    });
    await newUser.save().then((data) => res.status(200).send(data));
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

// read data

const getAllCandidats = async (req, res) => {
  // console.log(req.user._id);
  Candidate.find({ quizmaster: req.user._id })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving questions.",
      });
    });
  // res.status(200).send(result);
};

//delete

const deleteCandidat = async (req, res) => {
  const { id } = req.params;
  let user = await Candidate.findOne({ id });

  if (user) {
    await user.remove();
    res.json({ message: "user Removed" });
  } else {
    res.status(404);
    res.json({ message: "user not Found" });
  }
};

// update

const updateCandidat = async (req, res) => {
  // try {
  const { firstName, lastName, email, password } = req.body;
  try {
    await Skill.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        },
      }
      // { new: true }
    );
    // await updateSkill.save();

    res.status(200).send({
      message: "updated successfully",
    });
  } catch (error) {
    console.error(error);
  }
};

//get single user

const getCandidatById = async (req, res) => {
  try {
    const user = await Candidate.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  createCandidat,
  getAllCandidats,
  getCandidatById,
  deleteCandidat,
  updateCandidat,
};
