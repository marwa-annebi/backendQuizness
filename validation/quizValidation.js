const Joi = require("joi");

const quizAdd = (data) => {
  const schema = Joi.object({
    quizName: Joi.string().required(),
    nbQuestion: Joi.number().min(10).required(),
    duration: Joi.number().min(15).required(),
    Tauxscore: Joi.number().min(50).max(100).required(),
    creation_date: Joi.required(),
    validation_date: Joi.required(),
  });
  return schema.validate(data);
};

module.exports = { quizAdd };
