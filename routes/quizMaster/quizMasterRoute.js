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
  deleteProposition,
  updateProposition,
  getPropositionById,
  findAllProposition,
} = require("../../controllers/quizMaster/propositionController");
const {
  createQuestion,
  deleteQuestion,
  findAll,
} = require("../../controllers/quizMaster/questionController");
const {
  finishQuestion,
} = require("../../controllers/quizMaster/questionMakerController");
const {
  createQuiz,
  findAllQuiz,
  deleteQuiz,
} = require("../../controllers/quizMaster/quizController");

const router = express.Router();

//category

router.route("/createCategory").post(createCategory);
router.route("/getAll").get(getCategories);
router
  .route("/category/:id")
  .put(updateCategory)
  .delete(deleteCategory)
  .get(getCategoryById);

//question

router.route("/createQuestion").post(createQuestion);
router.route("/getAllQuestions").get(findAll);
router.route("/deleteQuestion/:id").delete(deleteQuestion);

//proposition

router.route("/createProposition").post(createProposition);
router.route("/getAllProposition").get(findAllProposition);
router
  .route("/proposition/:id")
  .delete(deleteProposition)
  .put(updateProposition)
  .get(getPropositionById);

// question maker

router.route("/finishQuestion").post(finishQuestion);

// quiz

router.route("/createQuiz").post(createQuiz);
router.route("/findAllQuiz").get(findAllQuiz);
router.route("/quiz/:id").delete(deleteQuiz);


module.exports = router;
