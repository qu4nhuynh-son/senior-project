const express = require("express");
const Task = require("../models/task");
const router = express.Router();
const User = require("../models/user");


// Route dành cho chatbot tạo task
router.post("/chatbot-add-task", async (req, res) => {
  try {
    const { title, desc } = req.body;

    const newTask = new Task({
      title,
      desc,
      complete: false,
      due: "Today",
      overdue: false
    });

    await newTask.save();

    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Bot failed to create task", error });
  }
});

// Lấy tất cả task
router.get("/get-all-tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

// Tạo task mới
router.post("/create-task", async (req, res) => {
  try {
    const { title, desc, complete, due, overdue, important } = req.body;
    const newTask = new Task({ title, desc, complete, due, overdue, important });
    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error creating task" });
  }
});


// Cập nhật task
router.put("/update-task/:id", async (req, res) => {
  try {
    const { title, desc, completed } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, desc, completed },
      { new: true }
    );

    res.status(200).json({ success: true, task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

// Xóa task
router.delete("/delete-task/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task" });
  }
});


router.post("/mark-task-complete", async (req, res) => {
  try {
    const { taskId } = req.body;

    // ✅ Đánh dấu task là completed
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.complete = true;
    task.completedAt = new Date();
    await task.save();

    // ❌ Bỏ toàn bộ logic userId và streak

    res.status(200).json({ success: true, message: "Task marked complete", task });
  } catch (err) {
    console.error("❌ Failed to mark task complete:", err);
    res.status(500).json({ message: "Failed to complete task" });
  }
});


module.exports = router;

