require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const bodyparser = require("body-parser");
const xmlhttprequest = require("xmlhttprequest")




// app.use(cors());
const corsOptions = {
  origin: ["http://localhost:3000", "http://way-force-nu.vercel.app"],
  methods: ["GET", "POST"],
  credentials: true,
};
 
app.use(cors(corsOptions));

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("Db conneted succesfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.get("/home",(req, res) => {
  res.status(200).send({msg:"Working App"});
});



app.use("/api/v1", require("./routes/routes"))


app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})








