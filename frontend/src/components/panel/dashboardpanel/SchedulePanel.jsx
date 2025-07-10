import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const pastelBlueVariants = [
  "bg-sky-100 text-sky-800",
  "bg-blue-100 text-blue-800",
  "bg-indigo-100 text-indigo-800",
  "bg-cyan-100 text-cyan-800",
  "bg-slate-100 text-slate-800",
];

const SchedulePanel = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchUpcoming = async () => {
      const res = await fetch("http://localhost:5001/api/calendar/upcoming");
      const data = await res.json();
      setEvents(data);
    };

    fetchUpcoming();
    window.addEventListener("calendar-updated", fetchUpcoming);
    return () => window.removeEventListener("calendar-updated", fetchUpcoming);
  }, []);

  const handleViewAll = () => {
    navigate("/upcoming");
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Schedule</h2>
        <button
          onClick={handleViewAll}
          className="text-sm text-blue-500 hover:underline font-medium"
        >
          View All
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {events.length === 0 ? (
          <p className="text-gray-400 text-sm">No upcoming events.</p>
        ) : (
          events.map((event, index) => {
            const start = new Date(event.start);
            const end = new Date(event.end);

            const dayLabel = start.toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });

            const startTime = start.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            const endTime = end.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Pick a pastel blue variant
            const colorClass =
              pastelBlueVariants[index % pastelBlueVariants.length];

            return (
              <div
                key={index}
                className={`rounded-xl p-3 ${colorClass} space-y-1`}
              >
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="font-medium">
                    {dayLabel.split(",")[0]}
                  </span>
                  <span>{dayLabel.split(" ").slice(1).join(" ")}</span>
                </div>
                <div className="text-sm font-semibold">
                  {event.title}
                </div>
                <div className="text-xs">
                  {startTime} – {endTime}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SchedulePanel;
