const QuizMaster = require("./../../models/Users/quizMasterModel");

const createUser = async (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  const newUser = new QuizMaster({
    firstName,
    lastName,
    email,
    password,
  });
  try {
    newUser.save().then(() => {
      newUser._id;
    });
  } catch (error) {
    console.error(error);
  }
};

// read data

const getAllUsers = async (req, res) => {
  QuizMaster.find({}, (error, result) => {
    if (error) {
      res.send(error);
    }
    res.status(200).send(result);
  });
};

//delete

const deleteUser = async (req, res) => {
  const user = await QuizMaster.findById(req.params.id);

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
    const updatedUser = await QuizMaster.findByIdAndUpdate(
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
    const user = await QuizMaster.findById(req.params.id);
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
