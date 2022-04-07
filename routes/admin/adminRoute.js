const express = require("express");
const {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
} = require("../../controllers/admin/crudQuizMaster");
const router = express.Router();
router.route("/createUser").post(createUser);
router.route("/getUsers").get(getAllUsers);
router.route("/deleteUser/:id").delete(deleteUser);
router.route("/updateUser/:id").put(updateUser);
router.route("/getUser/:id").get(getUserById);
module.exports = router;
