const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Quizmaster = require("../models/users/quizmasterModel");
const Candidate = require("../models/users/candidateModel");

const Admin = require("../models/users/adminModel");

const verifTokenQuizmaster = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Quizmaster.findById(decoded.id).select("-password");
        console.log(req.user);
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) res.status(401).send("not token");
});

const verifTokenAdmin = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
    // req.headers["x-access-token"]
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // token= req.headers["x-access-token"];
      if (token) {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Admin.findById(decoded.id).select("-password");
        console.log(req.user);
      }
      console.log(token);
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) res.status(401).send("not token");
});

const verifTokenCandidate = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Candidate.findById(decoded.id).select("-password");
        // console.log(req.user);
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
  if (!token) res.status(401).send("not token");
});


module.exports = { verifTokenQuizmaster, verifTokenCandidate, verifTokenAdmin };
