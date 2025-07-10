import React from "react";
import { format, isToday } from "date-fns";

const ScheduleDayCell = ({ day, events }) => {
  return (
    <div className="min-h-[80px] px-2">
      <div className={`text-sm mb-1 text-center ${isToday(day) ? "text-red-500 font-bold" : "text-gray-700"}`}>
        {format(day, "dd")}
      </div>
      <div className="flex flex-col gap-1">
        {events.map((e, i) => (
          <div key={i} className={`${e.tagColor || 'bg-blue-100'} text-xs text-black px-2 py-1 rounded`}>
            {e.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleDayCell;
