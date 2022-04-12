const Proposition = require("../../models/propositionModel");

const createProposition = function (proposition) {
  // console.log(proposition.body);
  return Proposition.create(proposition).then((docProposition) => {
    // console.log(docProposition);
     return docProposition
    // return Question.findByIdAndUpdate(
    //   questionId,
    //   { $push: { propositions: docProposition._id } },
    //   { new: true, useFindAndModify: false }
    // );
    ;
  });
};
module.exports = { createProposition };
