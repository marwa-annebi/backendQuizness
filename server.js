const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./data/db");
var bodyParser = require('body-parser')
const app = express();
const authRoute = require("./routes/auth/authRoute");
const adminRoute = require("./routes/admin/adminRoute");
const quizMasterRoute=require("./routes/quizMaster/quizMasterRoute")
const candidateRoute=require("./routes/candidate/candidateRoute")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
// parse application/json
app.use(bodyParser.json())
dotenv.config();
connectDB();

app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/quizmaster",quizMasterRoute)
app.use("/candidate",candidateRoute)
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
