const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);

const bodyparser = require("body-parser");


app.use(cors({
  origin :"*",
}));

const manpower = require("./routes/ManPowerRoutes")
const helpp = require("./routes/helpAndsupportRoutes")
const employer = require("./routes/employerRoutes")
const agentt = require("./routes/agent")
const city  = require("./routes/selectcity")
const statee  = require("./routes/state")
const category  = require("./routes/categoryROute")
const bookingByEmployerr  = require("./routes/bookingByEmployer")
const OfferModell  = require("./routes/coupencode")
const termss  = require("./routes/admin/termsAndCondition")
///////////////////////////////////////////////////////
const auth  = require("./routes/admin/authadmin")
const adminn  = require("./routes/admin/dashboard")
const postVerificationn  = require("./routes/admin/postVerification")
const excel = require("./routes/AdminRoutes")
const rating = require("./routes/ratingRoute")
const subadmin = require("./routes/subadmin/authsubadmin")
const aboutUs = require("./routes/aboutUsRoutes")




require("dotenv").config();
const socketIo = require('socket.io');

// Initialize Socket.io and pass the HTTP server
const io = socketIo(server);

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;

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


io.on('connection', (socket) => { 
  console.log('A user connected')

  // Example: Send a welcome message to the connected client
  socket.emit('welcome', 'Welcome to the Socket.io server!');

  // ... (add your Socket.io event handling logic here)
  
  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  })
})

app.use("/api/v1/manpower",manpower);
app.use("/api/v1/helpp",helpp);
app.use("/api/v1/employer",employer);
app.use("/api/v1/agentt",agentt);
app.use("/api/v1/city",city);
app.use("/api/v1/statee",statee);
app.use("/api/v1/category",category);
app.use("/api/v1/bookingByEmployerr",bookingByEmployerr);
app.use("/api/v1/OfferModell",OfferModell);
app.use("/api/v1/termss",termss);
//////////////////////////////////////////////
app.use("/api/v1/auth",auth);
app.use("/api/v1/adminn",adminn);
app.use("/api/v1/postVerificationn",postVerificationn);
app.use("/api/v1/excel",excel);
app.use("/api/v1/ratingg",rating)
app.use("/api/v1/subadmin",subadmin)
app.use("/paymentt",require("./routes/payment"))
app.use("/api/v1/about",aboutUs)

app.listen(PORT, () => {

  console.log(`Server listening on port ${PORT}`);
});
















