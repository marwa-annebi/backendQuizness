const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
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
            req.user = decoded.id;
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


