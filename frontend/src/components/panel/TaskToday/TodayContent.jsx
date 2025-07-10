import FocusMode from "./FocusMode";

import { useState } from "react";
import { isSameDay, isAfter } from "date-fns";
import { FaEllipsisH, FaRegCalendarCheck, FaUserFriends, FaEllipsisV } from "react-icons/fa";
import { FiPlus, FiSearch } from "react-icons/fi";
import { Listbox } from "@headlessui/react";
import confetti from "canvas-confetti";
import axios from "axios";





const statusOptions = ["In Progress", "Approved", "In Review", "Waiting"];
const statusColors = {
  Approved: "bg-green-100 text-green-600",
  "In Progress": "bg-blue-100 text-blue-600",
  "In Review": "bg-yellow-100 text-yellow-600",
  Waiting: "bg-purple-100 text-purple-600",
};

const tabList = [
  { key: "All", label: "All" },
  { key: "Important", label: "Important" },
  { key: "Notes", label: "Notes" },
  { key: "Links", label: "Links" },
  { key: "Overdue", label: "Overdue" },
];

const TodayContent = ({
  tasks,
  setTasks,
  completeTask,
  addingTask,
  InlineTaskInput,
  setAddingTask,
  onConnectCalendar,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [focusTask, setFocusTask] = useState(null);
  const [activeTab, setActiveTab] = useState("All");

  // Tạo biến cho ngày hôm nay
// ⏰ Ngày hôm nay
const today = new Date();
today.setHours(0, 0, 0, 0);

// 👉 Tạo bản copy task đã phân loại, đồng thời lọc task complete
const normalizedTasks = tasks
  .filter((t) => !t.complete) // ✅ Lọc bỏ task đã hoàn thành
  .map((task) => {
    const taskDate = new Date(task.due);
    taskDate.setHours(0, 0, 0, 0);
    
    const isToday = isSameDay(taskDate, today);
    const isFuture = taskDate > today;
    const isOverdue = taskDate < today;

    return {
      ...task,
      upcoming: isFuture,
      overdue: isOverdue,
      today: isToday && !isFuture && !isOverdue && !task.group,
    };
  });



// ⚙️ Lọc từng nhóm hiển thị
const filteredTasks = normalizedTasks.filter((t) => {
  if (activeTab === "Important") return t.important;
  if (activeTab === "Notes") return t.type === "note";
  if (activeTab === "Links") return t.type === "link";
  if (activeTab === "Overdue") return t.overdue;
  return t.today;
});

const upcomingTasks = normalizedTasks.filter((t) => t.upcoming && !t.group);
const groupTasks = normalizedTasks.filter((t) => t.group);



  const updateStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleProgressChange = (taskId, newProgress) => {
    const parsed = parseInt(newProgress, 10);
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, progress: parsed } : task
      )
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-bold">Today Tasks</h1>
        <div className="flex space-x-2 relative">
          <div
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <button
              className="px-3 py-1.5 text-sm border rounded-md flex items-center"
              onClick={onConnectCalendar}
            >
              <FaRegCalendarCheck className="mr-2" /> Connect Calendar
            </button>
            {showTooltip && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-black text-white rounded-lg shadow-lg p-3 z-50">
                <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <img
                    src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_16_2x.png"
                    className="w-5 h-5"
                  />
                  Show calendar events
                </h3>
                <p className="text-sm text-gray-300">
                  Connect Google Calendar to show your events in Today and Upcoming.
                </p>
              </div>
            )}
          </div>
          <button
  className="px-3 py-1.5 text-sm border rounded-md flex items-center"
  onClick={() => setFocusTask({ text: "Custom Focus Session" })}
>
  <span className="mr-2">🌙</span> Focus Mode
</button>


        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-8">
          {/* Tabs */}
          <div className="flex space-x-6 border-b pb-2 mb-4 text-sm font-medium text-gray-600">
            {tabList.map(({ key, label }) => {
              const count = normalizedTasks.filter((t) => {
                if (key === "All") return !t.overdue;
                if (key === "Important") return t.important;
                if (key === "Notes") return t.type === "note";
                if (key === "Links") return t.type === "link";
                if (key === "Overdue") return t.overdue;
              }).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`pb-1 ${
                    activeTab === key
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "hover:text-indigo-600"
                  }`}
                >
                  {label} {count > 0 ? `(${count})` : ""}
                </button>
              );
            })}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="p-1">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      onChange={async () => {
                        try {
                          await axios.post("http://localhost:5001/api/v1/mark-task-complete", {
                            taskId: task.id,
                          });
                          completeTask(task.id);
                          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                        } catch (error) {
                          console.error("❌ Error marking task complete:", error);
                        }
                      }}
                      className="w-5 h-5 rounded-md border-gray-300 text-indigo-600"
                    />
                    <div>
                      <p className="text-base font-medium">{task.text}</p>
                      <p className="text-xs text-gray-400">{task.due}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {task.status && (
                      <span
                        className={`text-xs px-3 py-1 rounded-xl font-semibold shadow-sm ${
                          statusColors[task.status] || "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {task.status}
                      </span>
                    )}
                    <Listbox value={task.status} onChange={(value) => updateStatus(task.id, value)}>
                      <div className="relative">
                        <Listbox.Button className="p-1">
                          <FaEllipsisH className="text-gray-400 text-sm" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 right-0 bg-white border rounded shadow z-10 text-sm w-36">
                          {statusOptions.map((option, idx) => (
                            <Listbox.Option
                              key={idx}
                              value={option}
                              className={({ active }) =>
                                `px-3 py-2 cursor-pointer ${active ? "bg-indigo-50 text-indigo-600" : ""}`
                              }
                            >
                              {option}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>

                {task.status === "In Progress" && (
                  <div className="mt-3 flex items-center gap-3">
                    <label className="text-sm text-gray-500 w-20">Progress:</label>
                    <input
  type="range"
  min={0}
  max={100}
  step={1}
  value={Number(task.progress) ?? 0}
  onChange={(e) => handleProgressChange(task.id, e.target.value)}
  className={`w-40 h-2 appearance-none rounded-full bg-gray-200
    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:h-4
    [&::-webkit-slider-thumb]:w-4
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-indigo-500
    [&::-webkit-slider-thumb]:border-2
    [&::-webkit-slider-thumb]:border-white
    [&::-webkit-slider-thumb]:shadow-md
    [&::-webkit-slider-thumb]:hover:scale-110
    [&::-webkit-slider-thumb]:transition
    [&::-moz-range-thumb]:bg-indigo-500
    [&::-moz-range-thumb]:border-none
    focus:outline-none transition-all duration-300
  `}  
/>

                    <span className="text-sm font-medium text-indigo-600">
                      {task.progress || 0}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Task */}
          {addingTask ? (
            <InlineTaskInput
              onCancel={() => setAddingTask(false)}
              onAddTask={(newTask) => {
                newTask.progress = 0;
                setTasks((prev) => [...prev, newTask]);
                setAddingTask(false);
              }}
            />
          ) : (
            <button
              className="mt-4 flex items-center text-blue-500 hover:text-blue-700"
              onClick={() => setAddingTask(true)}
            >
              <FiPlus className="mr-2" /> Add Task
            </button>
          )}

          {/* Upcoming Tasks */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Upcoming Tasks</h2>
            <div className="space-y-2">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="text-base font-medium">{task.text}</p>
                    <p className="text-xs text-gray-400">Due: {task.due}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-xl font-semibold shadow-sm ${
                        statusColors[task.status] || "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {task.status}
                    </span>
                    <Listbox value={task.status} onChange={(value) => updateStatus(task.id, value)}>
                      <div className="relative">
                        <Listbox.Button className="p-1">
                          <FaEllipsisH className="text-gray-400 text-sm" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute mt-1 right-0 bg-white border rounded shadow z-10 text-sm w-36">
                          {statusOptions.map((option, idx) => (
                            <Listbox.Option
                              key={idx}
                              value={option}
                              className={({ active }) =>
                                `px-3 py-2 cursor-pointer ${active ? "bg-indigo-50 text-indigo-600" : ""}`
                              }
                            >
                              {option}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Meeting Schedule */}
        <div className="col-span-4 space-y-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">Meeting Schedule</h2>
            <div className="flex items-center gap-2">
              <FaUserFriends className="text-gray-500" />
              <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-medium shadow">
                {groupTasks.length}
              </div>
            </div>
          </div>

          {groupTasks.map((task) => (
            <div
              key={task.id}
              className="relative p-6 bg-purple-50 rounded-xl shadow-sm space-y-2"
            >
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
                <FaEllipsisV />
              </button>

              <p className="text-sm text-gray-500">
                {task.time ? `Time: ${task.time}` : `Time: ${task.due}`}
              </p>
              <p className="font-semibold text-base">{task.text}</p>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((index) => (
                  <img
                    key={index}
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${task.id}-${index}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full bg-white shadow border"
                  />
                ))}
              </div>
            </div>
          ))}

{focusTask && (
  <FocusMode task={focusTask} onClose={() => setFocusTask(null)} />
)}

        </div>
      </div>
    </div>
  );
};

export default TodayContent;
