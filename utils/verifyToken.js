const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User =require("../models/users/userModel")
const verifToken = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log(token);
      //decodes token id
      console.log("hello");
      if (token) {



        console.log("hii");
         decoded = jwt.verify(
          token,
          process.env.JWT_SECRET,
          function (err, decoded) {
            console.log(decoded);
            req.user = await User.findById(decoded.id).select("-password")
          }
        );
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }
});
module.exports =verifToken;


