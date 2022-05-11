const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./data/db");
var bodyParser = require('body-parser')
const app = express();
const authRoute = require("./routes/auth/authRoute");
const adminRoute = require("./routes/admin/adminRoute");
const quizMasterRoute=require("./routes/quizMaster/quizMasterRoute")
const candidateRoute=require("./routes/candidate/candidateRoute")
// socket 
const {Server} =require("socket.io")

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});
let onlineUsers = [];

const addNewUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (username) => {
  return onlineUsers.find((user) => user.username === username);
};

io.on("connection", (socket) => {
  socket.on("newUser", (username) => {
    addNewUser(username, socket.id);
  console.log("someonehas connected")
  });

  socket.on("sendNotification", ({ senderName, receiverName}) => {
    const receiver = getUser(receiverName);
    io.to(receiver.socketId).emit("getNotification", {
      senderName,
      
    });
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("someone has disconnected ")
  });

});
io.listen(4000);
// parse application/x-www-form-urlencoded
app.set('socketio', io);
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(verifyToken)
app.use(express.json({
  verify:(req,res,buffer)=> req['rawBody']=buffer,
}))
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
app.use("/candidate",candidateRoute)
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on PORT ${PORT}`));