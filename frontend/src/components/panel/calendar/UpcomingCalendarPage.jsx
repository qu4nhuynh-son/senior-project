import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import CalendarHeader from "./CalendarHeader";
import WeekGrid from "./WeekGrid";

// 👉 Danh sách 7 ngày bắt đầu từ hôm nay
const getWeekDates = (startDate) => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const successMessages = [
  "🎉 Great job! You nailed it!",
  "✅ Mission accomplished. Keep it up!",
  "👏 You just crushed a task. Well done!",
  "💪 Productivity level: 100%",
  "🔥 That’s how it’s done!",
  "🚀 Another goal down. You're unstoppable!",
  "🌟 You’re on fire today!",
  "🎯 You hit the mark! Nice work.",
];

const UpcomingCalendarPage = () => {
  // 👉 Đặt mặc định là ngày hôm nay (không trừ getDay)
  const [weekStart, setWeekStart] = useState(() => new Date());
  const [view, setView] = useState("Week");
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadCalendar = () => {
      fetch("http://localhost:5001/api/calendar")
        .then((res) => res.json())
        .then((data) => {
          const parsed = data.map((e) => ({
            ...e,
            start: new Date(e.start),
            end: new Date(e.end),
          }));
          setEvents(parsed);

          // 👉 Luôn set lại ngày bắt đầu là hôm nay
          setWeekStart(new Date());
        })
        .catch((err) =>
          console.error("❌ Failed to fetch calendar events", err)
        );
    };

    loadCalendar();

    window.addEventListener("calendar-updated", loadCalendar);
    return () => window.removeEventListener("calendar-updated", loadCalendar);
  }, []);

  const handleDeleteEvent = async (eventId) => {
    try {
      await fetch(`http://localhost:5001/api/calendar/${eventId}`, {
        method: "DELETE",
      });

      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      toast.success(
        successMessages[Math.floor(Math.random() * successMessages.length)]
      );
    } catch (err) {
      console.error("❌ Failed to delete event", err);
      toast.error("⚠️ Failed to complete the task.");
    }
  };

  const handleToday = () => setWeekStart(new Date());
  const handlePrevWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() - 7);
    setWeekStart(newStart);
  };
  const handleNextWeek = () => {
    const newStart = new Date(weekStart);
    newStart.setDate(newStart.getDate() + 7);
    setWeekStart(newStart);
  };

  const weekDates = getWeekDates(weekStart);

  return (
    <div className="flex flex-col h-full bg-gray-50 px-0 pt-1">
      <CalendarHeader
        currentWeek={weekStart}
        onToday={handleToday}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
        view={view}
        setView={setView}
      />

      <WeekGrid
        weekDates={weekDates}
        events={events}
        onEventClick={handleDeleteEvent}
      />
    </div>
  );
};

export default UpcomingCalendarPage;
