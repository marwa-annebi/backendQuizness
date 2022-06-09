const expressAsyncHandler = require("express-async-handler");
const Skill = require("../../models/skillModel");
const Quizmaster = require("../../models/users/quizmasterModel");
const createSkill = async (req, res) => {
  try {
    let { skill_name, requirements, budget } = req.body;
    const skillExists = await Skill.findOne({
      skill_name,
      quizmaster: req.user._id,
      // requirements,

      // // quizmaster,
    });
    console.log(skillExists);
    if (!skill_name || !requirements) {
      res.status(400).send({ message: "please fill all this fields " });
    }
    if (skillExists) {
      res.status(400).send({
        message: "skill with provided skill name exists",
      });
    } else {
      const newSkill = new Skill({
        quizmaster: req.user._id,
        skill_name,
        requirements,
        budget,
      });
      newSkill.save().then(() => {
        res.status(201).send({
          message: "Category saved",
        });
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
    });
  }
};

// update category

const updateSkill = expressAsyncHandler(async (req, res) => {
  const { skill_name, requirements, budget } = req.body;
  // console.log({ skill_name, requirements, budget });
  console.log("heloo");
  try {
    await Skill.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          skill_name: skill_name,
          requirements: requirements,
          budget: budget,
        },
      }
      // { new: true }
    );
    // await updateSkill.save();
    console.log("sucsssssss");
    res.status(200).send({
      message: "updated successfully",
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete category

const deleteSkill = expressAsyncHandler(async (req, res) => {
  await Skill.deleteOne({ _id: req.params.id })
    .then(res.send({ message: "skill was deleted successfully!" }))
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Skill ",
      });
    });
});
// getCategories for candidat
const getSkillsForCandidat = expressAsyncHandler(async (req, res) => {
  // var array = [];
  // await Category.find()
  //   .populate({ path: "quizmaster", match: { isTrialer: false } })
  //   .exec(function (err, result) {
  //     if (err) return handleError(err);
  //     for (let index = 0; index < result.length; index++) {
  //       const element = result[index];
  //       array.push(element);
  //     }
  //     return res.status(200).send(array);
  //   });
});

//read all by id quizmaster

const getSkillsByIdQuizMaster = expressAsyncHandler(async (req, res) => {
  const skills = await Skill.find({
    quizmaster: req.user._id,
  });
  res.json(skills);
});

const getSkillById = expressAsyncHandler(async (id) => {
  const skill = await Skill.findById(id);

  if (skill) {
    res.json(skill);
  } else {
    res.status(404).json({ message: "skill not found" });
  }
});

module.exports = {
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillsByIdQuizMaster,
  getSkillById,
  getSkillsForCandidat,
};
