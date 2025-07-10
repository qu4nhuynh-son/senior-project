import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CalendarHeader = ({ currentWeek, onToday, onPrevWeek, onNextWeek }) => {
  const month = currentWeek?.toLocaleDateString("en-US", { month: "long" });
  const year = currentWeek?.getFullYear();

  return (
    <div className="flex justify-between items-start px-6 py-4">
      <div>
        <div className="flex items-center space-x-4">
          <h2 className="text-[30px] font-semibold text-zinc-900 tracking-tight">
            {month} {year}
          </h2>
          <div className="flex items-center space-x-1 border rounded-full px-2 py-1 shadow-sm bg-white">
            <button onClick={onPrevWeek} className="p-1 text-gray-500 hover:text-black transition">
              <FaChevronLeft size={14} />
            </button>
            <button onClick={onToday} className="text-sm font-medium text-gray-600 hover:text-black px-2">
              Today
            </button>
            <button onClick={onNextWeek} className="p-1 text-gray-500 hover:text-black transition">
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        <p className="text-sm text-neutral-600 font-medium leading-snug tracking-wide mt-1">
          All your scheduled events appear here — plan, manage, and stay productive effortlessly.


          
        </p>
      </div>

      <button className="bg-neutral-800 text-white px-4 py-1.5 rounded-md hover:bg-neutral-900 transition">
        + Add Event
      </button>
    </div>
  );
};

export default CalendarHeader;
