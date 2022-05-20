const jwt = require("jsonwebtoken");

const generateJwtToken = (id,email) => {
    return jwt.sign({ id,email }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
  };