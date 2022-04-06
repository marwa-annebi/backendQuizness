const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./data/db");
const app = express();
const authRoute = require("./routes/authRoute");
app.use(express.json());
dotenv.config();
connectDB();

app.use("/auth", authRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
