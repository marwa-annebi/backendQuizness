const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./data/db");
const app = express();

dotenv.config();
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
