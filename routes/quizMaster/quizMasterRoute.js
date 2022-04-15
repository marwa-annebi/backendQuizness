const express = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} = require("../../controllers/quizMaster/categoryController");
const {
   createProposition,
} = require("../../controllers/quizMaster/propositionController");
const {
   createQuestion, deleteQuestion, findAll,
} = require("../../controllers/quizMaster/questionController");
const { finishQuestion } = require("../../controllers/quizMaster/questionMakerController");
const { createQuiz } = require("../../controllers/quizMaster/quizController");
const router = express.Router();

//category

router.route("/createCategory").post(createCategory);
router.route("/getAll").get(getCategories);
router.route("/updateCategory/:id").put(updateCategory);
router.route("/deleteCategory/:id").delete(deleteCategory);
router.route("/getCategoryById").get(getCategoryById);

//question

router.route("/createQuestion").post(createQuestion);
router.route("/deleteQuestion/:id").delete(deleteQuestion)
router.route("/getAll").get(findAll)
//proposition

router.route("/createProposition").post(createProposition);

// question maker

router.route("/finishQuestion").post(finishQuestion);

// quiz 

router.route('/createQuiz').post(createQuiz)

module.exports = router;
