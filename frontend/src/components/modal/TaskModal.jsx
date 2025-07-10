import { useState } from "react";
import { FaCalendarAlt, FaTimes, FaFlag, FaBell } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskModal = ({ onClose, onAddTask }) => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const clearDate = () => {
    setSelectedDate(null);
  };

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-30 z-50 pt-24">
      <div className="bg-white p-4 rounded-xl shadow-2xl w-[600px]">
        {/* Task Input */}
        <input
          type="text"
          className="w-full text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-0 border-none"
          placeholder="Plan team lunch Jan 10 at 12:30pm"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="text"
          className="w-full text-sm text-gray-600 placeholder-gray-400 mt-1 focus:outline-none focus:ring-0 border-none"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Task Options */}
        <div className="relative flex items-center gap-2 mt-4">
          {/* Date Picker Button */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center gap-1 px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100"
            >
              <FaCalendarAlt className="text-green-500" />
              {selectedDate ? selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Set Date"}
            </button>

            {/* Clear Date Button */}
            {selectedDate && (
              <button onClick={clearDate} className="text-gray-400 hover:text-red-500">
                <IoClose />
              </button>
            )}
          </div>

          {/* DatePicker Dropdown */}
          {showDatePicker && (
            <div className="absolute top-12 z-50">
              <div className="absolute mt-2 z-50 bg-white border rounded-lg shadow-xl p-3 w-64">
  {/* Quick Options */}
  <ul className="text-sm text-gray-700">
    <li
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
      onClick={() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setSelectedDate(tomorrow);
        setShowDatePicker(false);
      }}
    >
      <span>🌤️ Tomorrow</span>
      <span className="ml-auto text-gray-400">{new Date(Date.now() + 86400000).toLocaleDateString("en-US", { weekday: "short" })}</span>
    </li>
    <li
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
      onClick={() => {
        const today = new Date();
        const saturdayOffset = 6 - today.getDay(); // 6 = Saturday
        const weekend = new Date();
        weekend.setDate(today.getDate() + saturdayOffset);
        setSelectedDate(weekend);
        setShowDatePicker(false);
      }}
    >
      <span>🏖️ This weekend</span>
      <span className="ml-auto text-gray-400">Sat</span>
    </li>
    <li
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
      onClick={() => {
        const today = new Date();
        const nextMonday = new Date(today);
        const day = today.getDay();
        const diff = (8 - day) % 7 || 7;
        nextMonday.setDate(today.getDate() + diff);
        setSelectedDate(nextMonday);
        setShowDatePicker(false);
      }}
    >
      <span>📅 Next week</span>
      <span className="ml-auto text-gray-400">Mon</span>
    </li>
    <li
      className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
      onClick={() => {
        clearDate();
        setShowDatePicker(false);
      }}
    >
      <span>🚫 No Date</span>
    </li>
  </ul>

  <div className="mt-2">
    <DatePicker
      selected={selectedDate}
      onChange={(date) => {
        setSelectedDate(date);
        setShowDatePicker(false);
      }}
      inline
    />
  </div>
</div>

            </div>
          )}

          {/* Priority */}
          <button className="flex items-center gap-1 px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100">
            <FaFlag className="text-red-500" /> Priority
          </button>

          {/* Reminders */}
          <button className="flex items-center gap-1 px-3 py-1 text-sm bg-white border rounded hover:bg-gray-100">
            <FaBell className="text-yellow-500" /> Reminders
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-500">📥 Inbox</div>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-gray-200 rounded hover:bg-gray-300 text-sm" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              onClick={() => {
                if (task.trim()) {
                  onAddTask({
                    id: Date.now(),
                    text: task,
                    description,
                    due: selectedDate || null,
                    overdue: false,
                  });
                  onClose();
                }
              }}
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
