const jwt = require("jsonwebtoken");
const generateToken = (id,type,email) => {
  return jwt.sign({ id,type,email }, process.env.JWT_SECRET, {
    expiresIn: "365d",
  });
};
module.exports = generateToken;