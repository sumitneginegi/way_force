const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./config/DBConnect");
dotenv.config();
dbConnect()

app.get("/home", (req, res) => {
    res.send("Hello World!");
});


app.use(express.json());
app.use(cors());
app.use("/api/v1", require("./routes/routes"))

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})