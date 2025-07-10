const mongoose = require("mongoose");

const FeedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "buddies"],
      default: "public",
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

module.exports = mongoose.model("Feed", FeedSchema);
