const jwt = require("jsonwebtoken");
const generateToken = (id,type,email) => {
  console.log("hello")
  console.log(id);
  console.log(type);
  console.log(email);

  return jwt.sign({ id ,type,email}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE // 24 hour
  });
};
module.exports = generateToken;

