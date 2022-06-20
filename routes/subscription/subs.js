const { verifTokenQuizmaster } = require("./../../utils/verifyToken");
const express = require("express");
const {
  getPrices,
  PostSession,
} = require("../../controllers/subscription/subs");
const router = express.Router();
router.route("/getprices").get(getPrices);
router.route("/session").post(verifTokenQuizmaster, PostSession);
module.exports = router;
