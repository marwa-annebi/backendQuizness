const express = require("express");
const router = express.Router();
const { verifTokenAdmin } = require("../../utils/verifyToken");
const {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
  nbUserEachMonth,
  nbCandidatEachMonth,
  nbQuizEachMonth,
} = require("../../controllers/admin/crudQuizMaster");
router.route("/createUser").post(verifTokenAdmin, createUser);
router.route("/getUsers").get(verifTokenAdmin, getAllUsers);
router.route("/deleteUser/:id").delete(verifTokenAdmin, deleteUser);
router.route("/updateUser/:id").put(verifTokenAdmin, updateUser);
router.route("/getUser/:id").get(verifTokenAdmin, getUserById);
router.route("/usersEachMonth").get(nbUserEachMonth);
router.route("/nbCandidatEachMonth").get(nbCandidatEachMonth);
router.route("/nbQuizEachMonth").get(nbQuizEachMonth);

module.exports = router;
