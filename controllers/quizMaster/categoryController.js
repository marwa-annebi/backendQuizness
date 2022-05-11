const expressAsyncHandler = require("express-async-handler");
const Category = require("./../../models/categoryModel");
const User = require("../../models/users/userModel");
const verifToken =require("../../utils/verifyToken")
const createCategory = async (req, res) => {
  try {
    let { quizmaster, category_name } = req.body;
    const categoryExists = await Category.findOne({
      category_name,
      quizmaster,
    });
    console.log(categoryExists);
    if (categoryExists) {
      res.json({
        status: "FAILED",
        message: "Category with provided category name exists",
      });
    } else if (await User.findOne({ quizmaster, isTrailer: true })) {
      const newCategory = new Category({
        // quizmaster: req.quizmaster._id,
        quizmaster,
        category_name,
        isTrailer: true,
      });
      newCategory.save().then(() => {
        res.json({
          status: "SUCCESS",
          message: "Category saved",
        });
      });
    } else {
      const newCategory = new Category({
        // quizmaster: req.quizmaster._id,
        quizmaster,
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
    res.json({
      status: "FAILED",
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

const deleteCategory = expressAsyncHandler( verifToken ,async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: "category Removed" });
  } else {
    res.status(404);
    res.json({ message: "category not Found" });
  }
});

// getCategories for candidat
const getCategoriesForCandidat = expressAsyncHandler( verifToken ,async (req, res) => {
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

const getCategories = expressAsyncHandler( verifToken ,async (req, res) => {
  let { quizmaster } = req.body;

  const categories = await Category.find({
    // quizmaster: req.quizmaster._id
    quizmaster,
  });
  res.json(categories);
});

const getCategoryById = expressAsyncHandler( async (id) => {
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
