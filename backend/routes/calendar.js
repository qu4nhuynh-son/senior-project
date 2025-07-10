const express = require("express");
const router = express.Router();
const Event = require("../models/EventModel");

router.get("/", async (req, res) => {
  const events = await Event.find().sort({ start: 1 });
  res.json(events);
});

router.post("/", async (req, res) => {
  const event = await Event.create(req.body);
  res.status(201).json(event);
});
const mongoose = require("mongoose");

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.json({ message: "Event deleted", deletedId: req.params.id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET all events
router.get("/", async (req, res) => {
    const events = await Event.find().sort({ start: 1 });
    res.json(events);
  });
  
  
  // ✅ 📅 GET events for today
  router.get("/today", async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
  
      const events = await Event.find({
        start: { $gte: today, $lt: tomorrow }
      }).sort({ start: 1 });
  
      res.json(events);
    } catch (err) {
      console.error("Failed to fetch today events:", err.message);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });
  // 📅 Get events from today to next 7 days
router.get("/upcoming", async (req, res) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const next7 = new Date();
      next7.setDate(today.getDate() + 7);
      next7.setHours(23, 59, 59, 999);
  
      const events = await Event.find({
        start: { $gte: today, $lte: next7 },
      }).sort({ start: 1 });
  
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch upcoming events" });
    }
  });
  

module.exports = router;
