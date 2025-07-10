const express = require("express");
const cors = require("cors");
const connectDB = require("./conn/conn");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");
const chatRoutes = require("./routes/chat");
const calendarRoutes = require("./routes/calendar");
const feedRoutes = require("./routes/feed");

const app = express();
const PORT = process.env.PORT || 5001; // ✅ Đặt lên trước

app.use(cors());
app.use(express.json());

connectDB();

// ✅ Route test backend
app.get("/", (req, res) => {
  res.send("✅ Backend is running on port " + PORT);
});

// ✅ Mount API routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/v1", feedRoutes);

// ⛔ Dòng này bị lặp (nên xoá)
/// app.use("/api/user", require("./routes/user"));

app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
