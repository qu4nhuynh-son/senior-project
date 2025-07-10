import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css'; // giữ để không vỡ layout

const CalendarMini = () => {
  const [date, setDate] = useState(new Date());

  const tileClassName = ({ date: tileDate }) => {
    const today = new Date();
    if (tileDate.toDateString() === today.toDateString()) {
      return 'bg-indigo-400 text-white font-semibold';
    }
    return 'text-gray-700 hover:bg-indigo-100';
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Calendar</h2>
        <div className="flex gap-2">
          <button className="w-7 h-7 bg-indigo-400 text-white rounded-full flex items-center justify-center hover:bg-indigo-300">
            &lt;
          </button>
          <button className="w-7 h-7 bg-indigo-400 text-white rounded-full flex items-center justify-center hover:bg-indigo-300">
            &gt;
          </button>
        </div>
      </div>

      <div className="react-calendar-wrapper text-sm">
        <style>{`
          .react-calendar {
            width: 100%;
            border: none;
            font-family: 'Inter', sans-serif;
          }

          .react-calendar__navigation {
            display: none;
          }

          .react-calendar__month-view__weekdays {
            text-transform: uppercase;
            font-weight: 500;
            font-size: 0.75rem;
            color: #9ca3af;
            text-align: center;
            margin-bottom: 0.5rem;
          }

          .react-calendar__month-view__weekdays__weekday {
            padding: 0.5rem 0;
          }

          .react-calendar__tile {
            border-radius: 9999px;
            padding: 0.75rem 0;
            font-size: 0.875rem;
            transition: all 0.2s ease-in-out;
          }

          .react-calendar__tile--now {
            background-color: #6366f1 !important; /* indigo-500 */
            color: white !important;
            font-weight: 600;
          }

          .react-calendar__tile:enabled:hover {
            background: #e0e7ff; /* indigo-100 */
          }

          abbr[title] {
            text-decoration: none;
          }
        `}</style>

        <Calendar
          onChange={setDate}
          value={date}
          next2Label={null}
          prev2Label={null}
          tileClassName={tileClassName}
        />
      </div>
    </div>
  );
};

export default CalendarMini;
