const Joi = require("joi");

const addQuestion = (data) => {
  const schema = Joi.object({
    skill: Joi.string().required(),
    tronc: Joi.string().min(10).max(150).required(),
    // propositions: Joi.array().min(1).required(),
  });
  return schema.validate(data);
};

module.exports = { addQuestion };
