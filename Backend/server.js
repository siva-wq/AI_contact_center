const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

const userRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const issueRoutes = require("./routes/IssueRoutes");

dotenv.config();
const DB = require("./config/db");
const { getMsg } = require("./controllers/authController");

DB();

const app = express();
const server = http.createServer(app);

const corsOptions = {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


app.use("/virtual-assistant", userRoutes);
app.use("/virtual-assistant", chatRoutes);
app.use("/virtual-assistant", issueRoutes);


const io = require("socket.io")(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    //console.log("Connected:", socket.id);

    socket.on("join-room", (roomId, role) => {

        socket.join(roomId);
        console.log(`Socket ${role}-${socket.id} joined room ${roomId}`);
    });

    socket.on("send-message", ({ from, to, message }) => {
        const msg = { sender: from, message };
        console.log(msg, "to", to)
        socket.broadcast.to(to).emit("receive-msg", msg);
    });
});


const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server + Socket.IO running on http://localhost:${PORT}`);
});
