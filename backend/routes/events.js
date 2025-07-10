router.get("/today", async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
  
    const events = await Event.find({
      start: { $gte: today, $lt: tomorrow }
    }).sort({ start: 1 });
  
    res.json(events);
  });
  