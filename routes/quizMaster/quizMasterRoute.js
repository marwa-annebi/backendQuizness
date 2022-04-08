const express = require("express");
const { createCategory, updateCategory, deleteCategory, getCategories, getCategoryById } = require("../../controllers/quizMaster/categoryController");
const router =express.Router()
router.route('/createCategory').post(createCategory)
router.route('/getAll').get(getCategories)
router.route("/updateCategory/:id").put(updateCategory);
router.route("/deleteCategory/:id").delete(deleteCategory);
router.route("/getCategoryById/:id").get(getCategoryById);

module.exports=router