const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    important: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
    due: {
      type: String,
      default: "Today", // để hiển thị đúng trên TodayContent
    },
    overdue: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0, // ✅ thêm default để mỗi task có giá trị ban đầu
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", TaskSchema);
