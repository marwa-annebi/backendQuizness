const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./data/db");
const app = express();
const authRoute = require("./routes/auth/authRoute");
const adminRoute = require("./routes/admin/adminRoute");
const quizMasterRoute=require("./routes/quizMaster/quizMasterRoute")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config();
connectDB();

app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use('/quizmaster',quizMasterRoute)
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
