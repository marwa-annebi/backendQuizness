const Joi = require("joi");

const addSkill = (data) => {
  const schema = Joi.object({
    skill_name: Joi.string().min(3).max(8).required(),
    budget: Joi.number().required(),
    requirements: Joi.string().min(140).max(275).required(),
  });
  return schema.validate(data);
};

module.exports = { addSkill };
