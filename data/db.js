const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    //  useCreateIndex: true,
    //  econnectTries: 30,
    //       reconnectInterval: 500
    });
    console.log(`mongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    process.exit();
  }
};
module.exports = connectDB;
