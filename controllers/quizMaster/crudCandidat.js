const express = require("express");
const Candidate = require("../../models/users/candidateModel");
const createCandidat = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  const newUser = new Candidate({
    firstName,
    lastName,
    email,
    password,
  });
  try {
    newUser.save().then((result) => {
      result;
    });
  } catch (error) {
    console.error(error);
  }
};

// read data

const getAllCandidats = async (req, res) => {
  const result = Candidate.find(req.user._id);
  res.status(200).send(result);
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
  try {
    const updatedUser = await Candidate.findByIdAndUpdate(
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
