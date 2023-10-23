const express = require("express");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getCategoryByName
} = require("../controller/categoryCtrl");
const router = express.Router();



router.post("/create", createCategory);
router.get("/", getAllCategories);
router.get("/get/:categoryId", getCategoryById);
router.put("/update/:categoryId", updateCategory);
router.delete("/delete/:id",deleteCategory);
router.get("/get/getCategoryByName/:categoryName", getCategoryByName);

module.exports = router;
