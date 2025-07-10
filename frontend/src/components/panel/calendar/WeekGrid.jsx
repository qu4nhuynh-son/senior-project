import React from "react";
import EventBlock from "./EventBlock";

const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 8AM – 6PM
const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WeekGrid = ({ weekDates, events, onEventClick }) => {
  const today = new Date().toDateString();

  const getDurationHeight = (start, end) => {
    const duration = (new Date(end) - new Date(start)) / 60000; // minutes
    return Math.max((duration / 30) * 40, 40); // 40px for every 30 minutes, min 40
  };

  return (
    <div className="w-full grid grid-cols-8 overflow-y-auto text-sm bg-white rounded-xl shadow-md border border-gray-200">
      {/* Header row */}
      <div className="bg-transparent border-b border-r p-3 text-center text-xs text-gray-400 font-medium uppercase tracking-wide">
        Time
      </div>
      {weekDates.map((date, i) => {
        const isToday = date.toDateString() === today;
        return (
          <div
            key={i}
            className={`border-b border-r p-2 text-center font-semibold text-sm ${
              isToday
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-700"
            }`}
          >
            <div className="uppercase text-xs font-medium text-gray-400">
              {daysOfWeek[date.getDay()]}
            </div>
            <div className="text-base mt-1">{date.getDate()}</div>
          </div>
        );
      })}

      {/* Time grid */}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          {/* Cột giờ */}
          <div className="border-b border-r p-2 text-right text-gray-400 text-xs font-medium">
            {new Date(0, 0, 0, hour).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>

          {/* Các ngày tương ứng giờ đó */}
          {weekDates.map((date) => {
            const key = `${date.toDateString()}-${hour}`;
            const matchingEvents = events.filter(
              (event) => {
                const eventDate = new Date(event.start);
                return (
                  eventDate.getHours() === hour &&
                  eventDate.toDateString() === date.toDateString()
                );
              }
            );

            return (
              <div
                key={key}
                className="border-b border-r h-20 relative hover:bg-blue-50 transition duration-200"
              >
                {matchingEvents.map((event, index) => (
                  <div
                    key={index}
                    onClick={() => onEventClick(event._id)}
                    className="absolute left-0 right-0 px-1 rounded-md overflow-hidden"
                    style={{ height: `${getDurationHeight(event.start, event.end)}px`, top: 0 }}
                  >
                    <EventBlock event={event} />
                  </div>
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeekGrid;
