const AboutUs = require("../models/aboutUsModel");

const create = async (req, res) => {
  try {
    const aboutUs = await AboutUs.create(req.body);
    return res.status(200).json({message:"About us created successfully", aboutUs});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message});
  }
};
const getAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.find().lean();
    if (!aboutUs) {
      return res.status(404).json("About us not found");
    }
return res.status(200).json( "About us retrieved successfully", aboutUs);
  } catch (error) {
    console.error;
    return createResponse(res, 500, "Internal server error");
  }
};


const updateAboutUs = async (req, res) => {
  const { imageUrl, title, content } = req.body;
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs) {
      return res.status(404).json("About us not found");
    }
    aboutUs.title = title || aboutUs.title;
    aboutUs.content = content || aboutUs.content;
    if (imageUrl && imageUrl !== aboutUs.imageUrl) {
      aboutUs.imageUrl = imageUrl || aboutUs.imageUrl;
    }
    const updatedAboutUs = await aboutUs.save();
    return res.status(200).json({
      message:"About us updated successfully",
      data:updatedAboutUs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const deleteAboutUs = async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndDelete(req.params.id);
    if (!aboutUs) {
      return res.status(404).json({ message: "About us not found" });
    } else {
      return res.status(200).json({ message: "About us deleted successfully" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  create,
  getAboutUs,
  updateAboutUs,
  deleteAboutUs
};
