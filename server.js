const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./data/db");
const app = express();
const authRoute = require("./routes/auth/authRoute");
const adminRoute = require("./routes/admin/adminRoute");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config();
connectDB();

app.use("/auth", authRoute);
app.use("/admin", adminRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
