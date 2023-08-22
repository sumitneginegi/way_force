require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyparser = require("body-parser");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Db connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// Set up your routes before applying CORS middleware
app.get("/home", (req, res) => {
  res.status(200).send({ msg: "Working App" });
});

app.use("/api/v1", require("./routes/routes"));

// Configure CORS
// const corsOptions = {
//   origin: ["http://localhost:3000", "https://way-force-nu.vercel.app"],
//   methods: ["GET", "POST"],
//   credentials: true,
// };
// app.use(cors(corsOptions));

app.use(cors({
  origin:"*"
}))

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {

  console.log(`Server listening on port ${PORT}`);
});
