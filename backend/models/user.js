const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Name is required"], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, "Email is required"], 
      unique: true, 
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"] 
    },
    password: { 
      type: String, 
      required: [true, "Password is required"], 
      minlength: [6, "Password must be at least 6 characters long"] 
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    lastCompletedAt: {
      type: Date,
      default: null
    },
    streakCount: {
      type: Number,
      default: 0
    },    
  },
  { timestamps: true } // Tự động thêm `createdAt` và `updatedAt`
);

module.exports = mongoose.model("User", UserSchema);
