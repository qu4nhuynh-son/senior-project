import React from "react";

import { useNavigate } from "react-router-dom";

import {
  FaUserFriends,
  FaRegEdit,
  FaShareAlt,
  FaClock,
  FaHourglassHalf,
  FaCalendarAlt,
} from "react-icons/fa";

const TodayTask = ({ tasks }) => {
  const navigate = useNavigate(); // ⬅️ Dòng mới
  const todayTasks = tasks.filter((task) => !task.upcoming);

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Today tasks</h2>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {["A", "B", "C"].map((initial, idx) => (
              <div
                key={idx}
                className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold border-2 border-white"
              >
                {initial}
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs border-2 border-white">
              +
            </div>
          </div>
          <FaRegEdit className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
          <FaShareAlt className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-4">
        {todayTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">You're all clear today 🎉</p>
        ) : (
          todayTasks.map((task, index) => {
            const date = new Date(task.due);
            const timeStr = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const dateStr = date.toLocaleDateString();

            return (
              <div
                key={index}
                className="bg-indigo-50 p-4 rounded-xl shadow-sm space-y-2"
              >
                <h3 className="text-sm font-semibold text-indigo-800">{task.text}</h3>

                <div className="text-xs text-gray-600 flex flex-wrap gap-4 items-center">
                  <span className="flex items-center gap-1">
                    <FaClock /> {timeStr}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHourglassHalf />
                    Duration: {task.duration || "02 h 00 m"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt />
                    {dateStr}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaUserFriends />
                    {task.members || 2} members
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-medium text-gray-700">
                    {task.progress || 0}%
                  </span>
                  <div className="w-32 h-2 bg-white border border-gray-300 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${task.progress || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodayTask;
