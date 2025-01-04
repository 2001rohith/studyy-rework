const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http")

// const { Server } = require("socket.io");

dotenv.config();
const PORT = process.env.PORT_NUMBER

//MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use('/uploads', express.static('uploads'));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 4000000 },
}));
app.use(passport.initialize());
app.use(cookieParser());
require("./config/passport");

//Routes
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
app.use("/user", userRoutes);
app.use("/course", courseRoutes);

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
});

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id)

    socket.on('send-message', ({ classId, userName, message }) => {
        console.log(`Message from ${userName} in class ${classId}: ${message}`)

        io.to(classId).emit('receive-message', { userName, message })
    });

    socket.on('end-live-class', ({ classId }) => {
        console.log(`teacher ended class`);
        io.to(classId).emit('teacher-ended-class');
    });

    socket.on('join-class', (classId) => {
        socket.join(classId);
        console.log(`User ${socket.id} joined class ${classId}`);
    });

    socket.on("notificationAdded", ({ courseId, teacherId }) => {
        console.log(`Notification added for course: ${courseId} by teacher: ${teacherId}`);

        io.emit("newNotification", { courseId });
    });

    socket.on('student-disconnected', ({ peerId, classId }) => {
        socket.to(classId).emit('student-disconnected', peerId);
    });

    socket.on('teacher-disconnected', ({ classId }) => {
        socket.to(classId).emit('teacher-ended-class');
    });

    socket.on('leave-class', (classId) => {
        socket.leave(classId);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
