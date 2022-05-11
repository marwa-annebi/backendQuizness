const verifyToken = require("./../../utils/verifyToken");
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
const {createCandidat,deleteCandidat,getAllCandidats,getCandidatById,updateCandidat} =require("../../controllers/quizMaster/crudCandidat");
const verifyToken = require("../../utils/verifyToken");
router.route("/createCandidat").post(verifyToken,createCandidat);
router.route("/getCandidats").get(verifyToken,getAllCandidats);
router
  .route("/candidat/:id")
  .put(verifyToken,updateCandidat)
  .delete(verifyToken,deleteCandidat)
  .get(verifyToken,getCandidatById);
  router.route("/subscriptionPayment").post(verifyToken,subscriptionPayment);

//category

router.route("/createCategory").post(verifyToken,createCategory);
router.route("/getAll").get(verifyToken,getCategoriesForCandidat);
router
  .route("/category/:id")

  .put(verifyToken,updateCategory)
  .delete(verifyToken,deleteCategory)
  .get(verifyToken,getCategoryById);


//question

router.route("/createQuestion").post(verifyToken,createQuestion);
router.route("/getAllQuestions").get(verifyToken,findAll);
router.route("/deleteQuestion/:id").delete(verifyToken,deleteQuestion);

//proposition

router.post("/createProposition").post(createProposition);
router.route("/getAllProposition").get(verifyToken,findAllProposition);
router
  .route("/proposition/:id")
  .delete(deleteProposition)
  .put(updateProposition)
  .get(getPropositionById);

// question maker

router.route("/finishQuestion").post(verifyToken,finishQuestion);
router.route("/nbofproposition").post(nbofProposition);

// quiz

router.route("/createQuiz").post(verifyToken,createQuiz);
router.route("/findAllQuiz").get(verifyToken,findAllQuiz);
router.route("/quiz/:id").delete(verifyToken,deleteQuiz);
// voucher


router.route("/createVoucher").post(verifyToken,createVoucher)
router.route("/getVoucherByIdCandidat/:id").get(verifyToken,getVoucherByIdCandidat);
router
  .route("/voucher/:id")
  .put(verifyToken,updateVoucher)
  .delete(verifyToken,deleteVoucher)
  .get(verifyToken,getVoucherById)


module.exports = router;
