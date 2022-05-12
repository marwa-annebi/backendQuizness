const expressAsyncHandler = require("express-async-handler");
const Category = require("./../../models/categoryModel");
const User = require("../../models/users/userModel");
const verifToken = require("../../utils/verifyToken");
const createCategory = async (req, res) => {
  try {
    let { category_name } = req.body;
    const categoryExists = await Category.findOne({
      category_name,
      quizmaster: req.user._id,
    });
    console.log(categoryExists);
    if (categoryExists) {
      res.status(400).send({
        message: "Category with provided category name exists",
      });
    } else if (
      await User.findOne({ quizmaster: req.user._id, isTrailer: true })
    ) {
      const newCategory = new Category({
        quizmaster: req.user._id,
        category_name,
        isTrailer: true,
      });
      newCategory.save().then(() => {
        res.status(201).send({
          message: "Category saved",
        });
      });
    } else {
      const newCategory = new Category({
        quizmaster: req.user._id,
        category_name,
      });
      newCategory.save().then(() => {
        res.json({
          status: "SUCCESS",
          message: "Category saved",
        });
      });
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

// update category

const updateCategory = expressAsyncHandler(async (req, res) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.status(200).send({
      message: "updated successfully",
      updateCategory,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// delete category

const deleteCategory = expressAsyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category.quizmaster.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You can't perform this action");
  }

  if (category) {
    await category.remove();
    res.status(200).send({ message: "category Removed" });
  } else {
    res.status(404).send({ message: "category not Found" });
  }
});
// getCategories for candidat
const getCategoriesForCandidat = expressAsyncHandler(async (req, res) => {
  var array = [];
  await Category.find()
    .populate({ path: "quizmaster", match: { isTrialer: false } })
    .exec(function (err, result) {
      if (err) return handleError(err);
      for (let index = 0; index < result.length; index++) {
        const element = result[index];
        array.push(element);
      }
      return res.status(200).send(array);
    });
});

//read all by id quizmaster

const getCategories = expressAsyncHandler(async (req, res) => {
  const categories = await Category.find({
    quizmaster: req.user._id,
  });
  res.json(categories);
});

const getCategoryById = expressAsyncHandler(async (id) => {
  const category = await Category.findById(id);

  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ message: "category not found" });
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  getCategoriesForCandidat,
};
