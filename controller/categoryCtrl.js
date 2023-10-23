const Category = require("../models/categoryModel"); 


exports.createCategory = async (req, res) => {
  try {
    const { name, price, status } = req.body;

    // Check if a category with the same name already exists
    const existing = await Category.find({ name: { $regex: new RegExp(name, 'i') }});
    if (existing) {
      return res.status(409).json({ error: "Category already in use" });
    }

    // Create a new category instance
    const category = new Category({
      name,
      price,
      status,
    });

    // Save the category to the database
    await category.save();

   return res.status(201).json({ message: "Category created successfully", data: category });
  } catch (error) {
    console.error(error);
   return res.status(500).json({ error: "Something went wrong" });
  }
};


exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
        return res.status(409).json({ error: "category not found" });
      }
   return res.status(200).json({ data: categories })
  } catch (error) {
  return  res.status(500).json({ error: "Something went wrong" })
  }
}



exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

   return res.status(200).json({ data: category });
  } catch (error) {
   return res.status(500).json({ error: "Something went wrong" });
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, price, status } = req.body;

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name;
    category.status = status;
    category.price = price;

    await category.save();

   return res.status(200).json({ message: "Category updated successfully", data: category });
  } catch (error) {
   return res.status(500).json({ error: "Something went wrong" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {

    const category = await Category.findByIdAndDelete({_id:req.params.id});

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error to help with debugging
    return res.status(500).json({ error: "Something went wrong" });
  }
};



exports.getCategoryByName = async (req, res) => {
  try {
    const category = await Category.find({ name: { $regex: new RegExp(req.params.categoryName, 'i') }});

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    return res.status(200).json({ data: category });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
