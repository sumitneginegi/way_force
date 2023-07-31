const Category = require("../models/categoryModel"); 

exports.createCategory = async (req, res) => {
  try {
    const { name,  status } = req.body;
    const existing = await Category.findOne({ name })
    if (existing) {
      return res.status(409).json({ error: "category already in use" });
    }
    const category = new Category({
      name,
      status,
    })
    await category.save()

    res.status(201).json({ message: "Category created successfully", data: category });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
        return res.status(409).json({ error: "category not found" });
      }
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name,  status } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;
    category.status = status;

    await category.save();

    res.status(200).json({ message: "Category updated successfully", data: category });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
