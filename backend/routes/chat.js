const express = require("express");
const router = express.Router();
const axios = require("axios");
const Task = require("../models/task");
const Chat = require("../models/ChatModel");
const Event = require("../models/EventModel");

require("dotenv").config();

router.post("/", async (req, res) => {
  const { message } = req.body;

  try {
    // =====================
    // Clean message
    // =====================
    const cleanMessage = message.replace(/^hey baobao[,:]?\s*/i, '').trim();

    // =====================
    // 1. 🧠 Reminder mỗi ngày
    // =====================
    const recurringRegex = /set (?:a )?(?:reminder|note|event)? (?:for )?(everyday|each day|daily).*(?:at )(\d{1,2})(?::(\d{2}))? ?(am|pm)?.*?(?:to|for|about)? (.+)/i;
    const match = cleanMessage.match(recurringRegex);

    if (match) {
      const [_, , hourStr, minuteStr, ampm, desc] = match;
      const hour = parseInt(hourStr);
      const minute = parseInt(minuteStr) || 0;
      const isPM = ampm?.toLowerCase() === "pm";
      const finalHour = isPM && hour < 12 ? hour + 12 : hour;

      const events = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        date.setHours(finalHour, minute, 0, 0);

        const event = await Event.create({
          title: desc,
          start: date,
          end: new Date(date.getTime() + 60 * 60 * 1000),
          tagColor: "bg-blue-200",
          description: "Created by BaoBao recurring logic",
        });

        events.push(event);
      }

      return res.json({
        reply: `✅ BaoBao has scheduled your reminder "${desc}" at ${finalHour}:00 for the next 7 days.`,
        calendarEvents: events,
      });
    }

    // =====================
    // 2. 📅 Reminder mỗi tháng
    // =====================
    const monthlyRegex = /(?:remind|set|create).*?(every|each)? ?month.*?(?:to|about|for)? (.+)/i;
    const matchMonthly = cleanMessage.match(monthlyRegex);

    if (matchMonthly) {
      const desc = matchMonthly[2] || matchMonthly[1];
      const events = [];
      const tagColors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-pink-200", "bg-purple-200"];
      const tagColor = tagColors[Math.floor(Math.random() * tagColors.length)];

      for (let i = 0; i < 6; i++) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + i;
        const firstDay = new Date(year, month, 1, 8);

        const event = await Event.create({
          title: desc,
          start: firstDay,
          end: new Date(firstDay.getTime() + 60 * 60 * 1000),
          tagColor,
          description: "Added by BaoBao",
        });

        events.push(event);
      }

      return res.json({
        reply: `📅 BaoBao has scheduled "${desc}" on the 1st of every month.`,
        calendarEvents: events,
      });
    }

    // =====================
    // ===== DELETE or EDIT by date + optional title =====
const delEditByDayRegex = /(delete|edit)\s(?:note|event|task)?(?:\s+on)?\s(\w+\s\d{1,2})(?:\s+about\s+(.+?))?(?:\s+to\s+["']?(.+?)["']?)?$/i;
const matchDelEditByDay = cleanMessage.match(delEditByDayRegex);

if (matchDelEditByDay) {
  const [_, action, dateStr, oldTitle = "", newTitle] = matchDelEditByDay;

  const [monthStr, dayStr] = dateStr.trim().split(" ");
  const month = new Date(`${monthStr} 1, 2000`).getMonth();
  const day = parseInt(dayStr);
  const year = new Date().getFullYear();

  const startOfDay = new Date(year, month, day, 0, 0, 0);
  const endOfDay = new Date(year, month, day, 23, 59, 59);

  const query = {
    start: { $gte: startOfDay, $lte: endOfDay },
  };

  if (oldTitle) {
    query.title = new RegExp(oldTitle, "i"); // match theo tiêu đề chứa
  }

  if (action === "edit" && newTitle) {
    const updated = await Event.findOneAndUpdate(query, { $set: { title: newTitle } }, { new: true });
    return res.json({
      reply: updated
        ? `✏️ Edited event to "${newTitle}" on ${dateStr}.`
        : `⚠️ Couldn't find event to edit on ${dateStr}.`,
      calendarEvents: updated ? [updated] : [],
    });
  }
}

    // =====================
// 4. 🤖 Add by time (natural)
// =====================
const quickCommandRegex = /(remind|note|task|todo|event|schedule|remember|add)(?: me)?(?: to)? (.+?) on (\w+ \d{1,2})(?: at (\d{1,2})(?::(\d{2}))?\s?(am|pm)?)?/i;
const matchSmart = cleanMessage.match(quickCommandRegex);

if (matchSmart) {
  const [, , content, dateStr, hourStr, minuteStr, ampm] = matchSmart;
  const [monthStr, dayStr] = dateStr.trim().split(" ");
  const month = new Date(`${monthStr} 1, 2000`).getMonth();
  const day = parseInt(dayStr);
  const year = new Date().getFullYear();

  const date = new Date(year, month, day);

  // Parse time properly
  const rawHour = hourStr ? parseInt(hourStr) : null;
  const rawMinute = minuteStr ? parseInt(minuteStr) : 0;

  let finalHour;
  if (rawHour !== null) {
    finalHour = ampm?.toLowerCase() === "pm" && rawHour < 12 ? rawHour + 12 : rawHour;
  } else {
    finalHour = 9; // fallback if hour not found
  }

  date.setHours(finalHour, rawMinute, 0, 0);

  const tagColors = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-pink-200", "bg-purple-200"];
  const tagColor = tagColors[Math.floor(Math.random() * tagColors.length)];

  const calendarEvent = await Event.create({
    title: content,
    start: date,
    end: new Date(date.getTime() + 60 * 60 * 1000),
    tagColor,
    description: "",
  });

  return res.json({
    reply: `✅ Hey ${req.body.name || "there"}! I’ve added “${content}” on ${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. Let’s crush this! 💪`,
    calendarEvents: [calendarEvent],
  });
}

        // Inside the try-catch, after other regex fails
if (!match && !matchMonthly && !matchDelEditByDay && !matchSmart) {
  const aiResponse = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are BaoBao, an AI assistant helping users schedule tasks or events on a calendar. From any natural sentence like "remind me to do X at Y on Z", extract the action, title, time, and date.`,
        },
        {
          role: "user",
          content: `Extract event details from: "${cleanMessage}"`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const extracted = aiResponse.data.choices[0].message.content;
  return res.json({
    reply: `🤖 I couldn’t match it perfectly, but based on your message, I understood: ${extracted}`,
  });
}

    // =====================
    // 5. 🤗 Motivational fallback
    // =====================
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are BaoBao, an empathetic AI assistant that motivates users on tough days.`,
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const botReply = response.data.choices[0].message.content;
    await Chat.create({ userMessage: message, botResponse: botReply });
    return res.json({ reply: botReply });
  } catch (error) {
    console.error("❌ BaoBao error:", error.message);
    return res.status(500).json({ reply: "🚨 BaoBao is having trouble. Please try again later." });
  }
});

module.exports = router;
