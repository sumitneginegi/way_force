const User = require("../../models/user");


exports.getDashboard = async (req, res) => {
  try {
    // Group by userType and calculate the count for each userType
    const data = await User.aggregate([
      {
        $group: {
          _id: "$userType",
          count: { $sum: 1 },
        },
      },
    ]);

    let totalEmployer = 0;
    let totalManpower = 0;

    // Loop through the results and extract the counts for employer and manpower
    data.forEach((item) => {
      if (item._id === "employer") {
        totalEmployer = item.count;
      } else if (item._id === "manpower") {
        totalManpower = item.count;
      }
    });

    res.status(200).json({ totalEmployer, totalManpower });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
