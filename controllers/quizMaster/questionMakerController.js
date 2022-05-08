// create question and proposition and create relation between them
const expressAsyncHandler = require("express-async-handler");
const req = require("express/lib/request");
const { default: mongoose } = require("mongoose");
const Category = require("../../models/categoryModel");
const propositionModel = require("../../models/propositionModel");
const Question = require("../../models/questionModel");
const { createProposition } = require("./propositionController");
const { createQuestion } = require("./questionController");

const finishQuestion = async (req, res) => {
  const { question, proposition } = req.body;
  questionCreated = await createQuestion(question);
  console.log(questionCreated);
  resultUpdateCategory = await Category.findByIdAndUpdate(
    questionCreated.category,
    {
      $push: { questions: questionCreated._id },
    },
    { new: true, useFindAndModify: false }
  );
  //   questionCreated._id = new mongoose.Types.ObjectId();

  for (let index = 0; index < proposition.length; index++) {
    propositionCreated = await createProposition(proposition[index]);
    resultUpdateQuestion = await Question.findByIdAndUpdate(
      questionCreated._id,
      { $push: { propositions: propositionCreated._id } },
      { new: true, useFindAndModify: false }
    );
    resultUpdateProposition = await propositionModel.findByIdAndUpdate(
      propositionCreated._id,
      { question: questionCreated._id },
      { new: true, useFindAndModify: false }
    );
  }
if(!questionCreated || !propositionCreated ){
    res.send({result:'false'})
}
else res.send({result:'true'})
  // console.log(questionCreated);
  // console.log(propositionCreated);
};


const nbofProposition = expressAsyncHandler(async (req,res)=>{
  let nb=0;
  const{ id_question}=req.body;
  const proposition = await propositionModel.find({question:id_question})
  console.log(proposition)
  for (let index = 0; index < proposition.length; index++) {
    nb=nb+1
  }
  res.json({
    nb,
    proposition,
    
})

})

module.exports = { finishQuestion ,nbofProposition};
