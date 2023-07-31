const express = require("express");
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require("../controller/categoryCtrl");
const router = express.Router();



router.post("/create", createCategory);
router.get("/", getAllCategories);
router.get("/get/:categoryId", getCategoryById);
router.put("/update/:categoryId", updateCategory);
router.delete("/delete/:id",deleteCategory);

module.exports = router;
