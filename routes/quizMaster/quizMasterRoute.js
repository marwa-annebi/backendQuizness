const { verifTokenQuizmaster } = require("./../../utils/verifyToken");
const express = require("express");
const {
  subscriptionPayment,
} = require("../../controllers/quizMaster/subcriptionPayment");
const {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByIdQuizMaster,
  getSkillById,
  getSkillsForCandidat,
} = require("../../controllers/quizMaster/skillController");
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
  updateQuestion,
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

router.route("/createSkill").post(verifTokenQuizmaster, createSkill);
router.route("/getSkills").get(verifTokenQuizmaster, getSkillsByIdQuizMaster);

router
  .route("/skill/:id")
  .put(verifTokenQuizmaster, updateSkill)
  .delete(verifTokenQuizmaster, deleteSkill)
  .get(verifTokenQuizmaster, getSkillById);

//question

router.route("/createQuestion").post(createQuestion);
router.route("/getAllQuestions").get(verifTokenQuizmaster, findAll);
router
  .route("/Question/:id")
  .put(updateQuestion)
  .delete(deleteQuestion);

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

router.route("/finishQuestion").post(finishQuestion);
router.route("/nbofproposition").post(nbofProposition);

// quiz

router.route("/createQuiz").post(createQuiz);
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
