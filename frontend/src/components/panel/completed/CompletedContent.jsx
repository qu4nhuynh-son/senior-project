import React from "react";
import { FiLock } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";

const CompletedContent = ({ completedTasks }) => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Activity: All projects</h1>

        {completedTasks.length > 0 && (
          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center text-sm font-medium text-green-600">
              <FaCheckCircle className="text-green-500 mr-2" />
              {completedTasks.length} task{completedTasks.length > 1 && "s"} completed
            </div>
            <select className="px-2 py-1 border rounded text-sm">
              <option>All Time</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <button className="bg-indigo-500 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-600 transition">
              Export CSV
            </button>
          </div>
        )}
      </div>

      {/* No tasks fallback */}
      {completedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-24 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3208/3208707.png"
            alt="No activity"
            className="w-28 h-28 mb-4 opacity-90"
          />
          <p className="text-gray-800 font-semibold mb-1">
            No activity in the past week.
          </p>
          <p className="text-sm text-gray-500 max-w-md">
            See all changes that have been made in your account, by you or your
            collaborators. <br />
            Free users can still view their completed tasks inside any project.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">{today}</p>
          {completedTasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold relative">
                  B
                  <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">You</span> completed the
                    task:{" "}
                    <span className="underline cursor-pointer hover:text-indigo-600 transition">
                      {task.text}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(task.completedAt).toLocaleString("en-US", {
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                Inbox <FiLock className="ml-1" />
              </div>
            </div>
          ))}
          <p className="text-sm text-gray-400 mt-6 text-center">
            🎉 That's all. You’re doing amazing!
          </p>
        </div>
      )}
    </div>
  );
};

export default CompletedContent;
