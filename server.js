const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./data/db");
var bodyParser = require('body-parser')
const app = express();
const authRoute = require("./routes/auth/authRoute");
const adminRoute = require("./routes/admin/adminRoute");
const quizMasterRoute=require("./routes/quizMaster/quizMasterRoute")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
// parse application/json
app.use(bodyParser.json())
const cors = require("cors");
dotenv.config();
connectDB();
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,DELETE",
      credentials: true,
    })
  );
app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/quizmaster",quizMasterRoute)
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
