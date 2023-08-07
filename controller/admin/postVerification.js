const Employerr = require("../../models/user");
const Manpowerr = require("../../models/user");
const OTP = require("../../config/OTP-Generate");
const User = require("../../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const { loginManpower } = require("../ManPowerCtrl");

exports.viewInShortAdmin = async (req, res) => {
    try {
      const aggregationPipeline = [
        { $unwind: "$obj" },
        // Match documents with userType: "employer" and obj.instantOrdirect: "instant"
        { $match: { userType: "employer"} },
   
        {
          $project: {
            job_desc: "$obj.job_desc",
            employerName: "$obj.employerName",
            siteLocation: "$obj.siteLocation",
            no_Of_opening: "$obj.no_Of_opening",
            fullTime: "$obj.fullTime",
            maxiSalary: "$obj.maxSalary",
            miniSalary: "$obj.miniSalary",
            instantOrdirect: "$obj.instantOrdirect",
            orderId:"$obj.orderId",
            category:"$obj.category",
            date:"$obj.date"
          }
        }
      ];
    
      const result = await User.aggregate(aggregationPipeline).exec();
      res.status(200).send({ data: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };




  exports.verifyPostAdmin = async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const status = req.body.status;
  
      // Find the user document containing the post with the given orderId
      const user = await User.findOne({ 'obj': { $elemMatch: { orderId: orderId } } });
  
      if (!user) {
        return res.status(404).json({ error: 'Post not found.' });
      }
  
      // Find the specific post in the obj array using the orderId
      const postIndex = user.obj.findIndex((item) => item.orderId === orderId);
  
      if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found in obj array.' });
      }
  
      // Check if the post is already verified
      if (user.obj[postIndex].status === status) {
        return res.status(400).json({ error: 'Post is already checked.' });
      }
  
      // Update the status in the obj array for the specific orderId post
      user.obj[postIndex].status = status;
  
      // Mark 'obj' field as modified
      user.markModified('obj');
  
      // Save the changes to the database
      await user.save();
  
      res.status(200).json({ message: 'Post has been verified and status updated.', post: user.obj[postIndex] });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
