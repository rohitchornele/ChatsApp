import { connectDB } from "./config/db.js";
import { userRoutes } from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import { chatRoutes } from "./routes/chatRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import path from 'path';
import { createServer } from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();

app.use(express());
app.use(express.json());

const PORT = process.env.PORT || 8000;


    app.use("/api/user", userRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/message", messageRoutes);
    
    // ===================== Deployment ======================
    
    const __dirname = path.resolve();
    if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
    })
} else {
    app.get('/', (req, res) => {
        res.send("API is running successfully")
    })
}



app.use(notFound);
app.use(errorHandler);


const server = createServer();

app.listen(
  PORT,
  console.log(`Server is running on port ${PORT}`)
);

// const io = new Server();

const io = new Server(
    server,
    {
    
        pingTimeout: 60000,
        cors: {
          origin: "*",
        },
      
}
);


io.on("connection", (socket) => {
  socket.on(
      'setup', 
    (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    });


    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User joined room: " + room)
    })

    socket.on("new message", (newMessageRecieved) => {
        let chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("chat.users not defined")

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return ;

            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.off("setup", () => {
        console.log("User Disconnected");
        socket.leave(userData._id);
    })
});