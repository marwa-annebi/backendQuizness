const expressAsyncHandler = require("express-async-handler");
const Category = require("./../../models/categoryModel");
const createCategory = expressAsyncHandler(async (req, res) => {
  try {
    let { quizMasterID, category_name, questions } = req.body;
    const categoryExists = await Category.findOne({ category_name });
    console.log(categoryExists);
    if (categoryExists) {
      res.json({
        status: "FAILED",
        message: "Category with provided category name exists",
      });
    } else {
      const newCategory = new Category({
        // quizMasterID: req.quizMasterID._id,
        quizMasterID,
        category_name,
        questions,
      });
      newCategory.save().then(() => {
        res.json({
          status: "SUCCESS",
          message: "Category saved",
        });
      });
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

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

  if (category) {
    await category.remove();
    res.json({ message: "category Removed" });
  } else {
    res.status(404);
    res.json({ message: "category not Found" });
  }
});

//read all by id quizmaster

const getCategories = expressAsyncHandler(async (req, res) => {
  let { quizMasterID } = req.body;
  const categories = await Category.find({
    // quizmaster: req.quizmaster._id
    quizMasterID,
  });
  res.json(categories);
});

const getCategoryById = expressAsyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

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
};
