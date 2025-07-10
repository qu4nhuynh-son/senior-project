const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  tagColor: String,
  description: String,
  user: String, // có thể dùng sau nếu bạn hỗ trợ nhiều người
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
