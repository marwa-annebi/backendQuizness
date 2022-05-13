const Joi = require("joi");

//register validation

const registerValidation = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(10).required(),
    lastName: Joi.string().min(3).max(10).required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(6),
    // password_confirmation: Joi.any()
    //   .valid(Joi.ref("password"))
    //   .required()
    //   .options({ language: { any: { allowOnly: "must match password" } } }),
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
