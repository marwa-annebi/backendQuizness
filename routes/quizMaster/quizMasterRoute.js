const { verifTokenQuizmaster } = require("./../../utils/verifyToken");
const express = require("express");
const {
  subscriptionPayment,
} = require("../../controllers/quizMaster/subcriptionPayment");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoriesForCandidat,
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
  nbofProposition,
} = require("../../controllers/quizMaster/questionMakerController");
const {
  createQuiz,
  findAllQuiz,
  deleteQuiz,
} = require("../../controllers/quizMaster/quizController");
const {
  createVoucher,
  updateVoucher,
  getVoucherById,
  deleteVoucher,
  getVoucherByIdCandidat,
} = require("../../controllers/quizMaster/voucherController");
const router = express.Router();
// candidat
const {
  createCandidat,
  deleteCandidat,
  getAllCandidats,
  getCandidatById,
  updateCandidat,
} = require("../../controllers/quizMaster/crudCandidat");

router.route("/createCandidat").post(verifTokenQuizmaster, createCandidat);
router.route("/getCandidats").get(verifTokenQuizmaster, getAllCandidats);
router
  .route("/candidat/:id")
  .put(verifTokenQuizmaster, updateCandidat)
  .delete(verifTokenQuizmaster, deleteCandidat)
  .get(verifTokenQuizmaster, getCandidatById);
router
  .route("/subscriptionPayment")
  .post(verifTokenQuizmaster, subscriptionPayment);

//category

router.route("/createCategory").post(verifTokenQuizmaster, createCategory);
router.route("/getAll").get(verifTokenQuizmaster, getCategoriesForCandidat);
router.route("/getCategories").get(verifTokenQuizmaster, getCategories);

router
  .route("/category/:id")
  .put(verifTokenQuizmaster, updateCategory)
  .delete(verifTokenQuizmaster, deleteCategory)
  .get(verifTokenQuizmaster, getCategoryById);

//question

router.route("/createQuestion").post(verifTokenQuizmaster, createQuestion);
router.route("/getAllQuestions").get(verifTokenQuizmaster, findAll);
router
  .route("/deleteQuestion/:id")
  .delete(verifTokenQuizmaster, deleteQuestion);

//proposition

router.post("/createProposition").post(createProposition);
router
  .route("/getAllProposition")
  .get(verifTokenQuizmaster, findAllProposition);
router
  .route("/proposition/:id")
  .delete(deleteProposition)
  .put(updateProposition)
  .get(getPropositionById);

// question maker

router.route("/finishQuestion").post(verifTokenQuizmaster, finishQuestion);
router.route("/nbofproposition").post(nbofProposition);

// quiz

router.route("/createQuiz").post(verifTokenQuizmaster, createQuiz);
router.route("/findAllQuiz").get(verifTokenQuizmaster, findAllQuiz);
router.route("/quiz/:id").delete(verifTokenQuizmaster, deleteQuiz);
// voucher

router.route("/createVoucher").post(verifTokenQuizmaster, createVoucher);
router
  .route("/getVoucherByIdCandidat/:id")
  .get(verifTokenQuizmaster, getVoucherByIdCandidat);
router
  .route("/voucher/:id")
  .put(verifTokenQuizmaster, updateVoucher)
  .delete(verifTokenQuizmaster, deleteVoucher)
  .get(verifTokenQuizmaster, getVoucherById);

module.exports = router;
