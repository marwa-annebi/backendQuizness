const jwt = require("jsonwebtoken");
const generateToken = (id,type,email) => {
  return jwt.sign({ id ,type,}, process.env.JWT_SECRET, {
    expiresIn: 86400 // 24 hour
  });
};
module.exports = generateToken;