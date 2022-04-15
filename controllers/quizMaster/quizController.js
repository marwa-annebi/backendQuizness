const expressAsyncHandler = require("express-async-handler");
const Quiz = require("./../../models/quizModel");
const moment = require("moment");

const createQuiz = async (req,res) =>{
    // return Quiz.create(quiz).then((docquiz) => {
    //     console.log("\n>> Created Tutorial:\n", docquiz);
    //   return docquestion;
    // });
    const{ quizmaster,creation_date,validation_date,questions}=req.body
    const quiz = await new Quiz({
        quizmaster,
        creation_date: moment(creation_date).format("yyyy-MM-DD"),
        validation_date: moment(validation_date).format("yyyy-MM-DD"),
        questions
    }).save()
    for (let index = 0; index < questions.length; index++) {
    Quiz.findByIdAndUpdate(quiz._id,{
        $push : {questions : questions[index]._id}
    },
    { new: true, useFindAndModify: false }
    )}
  };

  const deleteQuiz = expressAsyncHandler(async (req, res) => {
    try {
      const deleted = await Quiz.deleteOne({ _id: req.params.id });
    } catch (e) {
      console.error(`[error] ${e}`);
      throw Error("Error occurred while deleting Question");
    }
  });
module.exports={createQuiz,deleteQuiz}