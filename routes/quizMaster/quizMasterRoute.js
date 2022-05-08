const express = require("express");
const {subscriptionPayment}=require("../../controllers/quizMaster/subcriptionPayment")
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
  finishQuestion,nbofProposition
} = require("../../controllers/quizMaster/questionMakerController");
const {
  createQuiz,
  findAllQuiz,
  deleteQuiz,
} = require("../../controllers/quizMaster/quizController");
const{createVoucher,updateVoucher,getVoucherById,deleteVoucher,getVoucherByIdCandidat} =require ("../../controllers/quizMaster/voucherController")
const router = express.Router();
// candidat
const {createCandidat,deleteCandidat,getAllCandidats,getCandidatById,updateCandidat} =require("../../controllers/quizMaster/crudCandidat");
router.route("/createCandidat").post(createCandidat);
router.route("/getCandidats").get(getAllCandidats);
router
  .route("/candidat/:id")
  .put(updateCandidat)
  .delete(deleteCandidat)
  .get(getCandidatById);
  router.route("/subscriptionPayment").post(subscriptionPayment);
//category

router.route("/createCategory").post(createCategory);
router.route("/getAll").get(getCategoriesForCandidat);
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
router.route("/nbofproposition").post(nbofProposition);

// quiz

router.route("/createQuiz").post(createQuiz);
router.route("/findAllQuiz").get(findAllQuiz);
router.route("/quiz/:id").delete(deleteQuiz);
// voucher
router.route("/createVoucher").post(createVoucher)
router.route("/getVoucherByIdCandidat/:id").get(getVoucherByIdCandidat);
router
  .route("/voucher/:id")
  .put(updateVoucher)
  .delete(deleteVoucher)
  .get(getVoucherById)

module.exports = router;
