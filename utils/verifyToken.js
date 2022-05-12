const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const User = require("../models/users/userModel");

const verifToken = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
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

module.exports = verifToken;
