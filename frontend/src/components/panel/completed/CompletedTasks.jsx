import React from "react";
import { FiLock } from "react-icons/fi";

const CompletedTasks = ({ completedTasks }) => {
  return (
    <div className="p-8 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Activity: All projects</h1>

      {completedTasks.length === 0 ? (
        <p className="text-gray-400">No completed tasks yet.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">{new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p>
          {completedTasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b pb-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-semibold relative">
                  N
                  <span className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">You</span> completed a task: <span className="underline cursor-pointer">{task.text}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(task.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                Inbox <FiLock className="ml-1" />
              </div>
            </div>
          ))}
          <p className="text-sm text-gray-400 mt-6 text-center">That's it. No more history to load.</p>
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
