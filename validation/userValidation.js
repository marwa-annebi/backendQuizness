const Joi = require("joi");

//register validation

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(25).trim(true).required(),
    lastName: Joi.string().min(3).max(10).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(7).label("password"),
    confirmpassword: Joi.any()
      .equal(Joi.ref("password"))
      .required()
      .label("confirmpassword")
      .messages({ "any.only": "{{#label}} does not match" }),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
