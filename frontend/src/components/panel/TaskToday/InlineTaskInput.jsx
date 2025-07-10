import { useState } from "react";
import { FaCalendarAlt, FaFlag, FaEllipsisH, FaChevronDown } from "react-icons/fa";
import { FiInbox } from "react-icons/fi";
import { Listbox } from "@headlessui/react";
import { DayPicker } from "react-day-picker";
import { format, isSameDay } from "date-fns";
import axios from "axios";
import "react-day-picker/dist/style.css";

const typeOptions = ["Task", "Note", "Link"];
const groupOptions = ["Individual", "Group"];
const repeatOptions = ["None", "Daily", "Weekly", "Monthly"];

const Dropdown = ({ selected, setSelected, options }) => (
  <Listbox value={selected} onChange={setSelected}>
    <div className="relative">
      <Listbox.Button className="w-36 flex justify-between items-center border px-4 py-1.5 rounded-full text-sm text-gray-700 bg-white shadow-sm hover:border-indigo-400 transition">
        {selected || "Select"}
        <FaChevronDown className="ml-2 text-xs text-gray-500" />
      </Listbox.Button>
      <Listbox.Options className="absolute mt-1 w-full bg-white border rounded shadow-md z-10 text-sm">
        {options.map((option, idx) => (
          <Listbox.Option
            key={idx}
            value={option}
            className={({ active }) =>
              `px-4 py-2 cursor-pointer ${
                active ? "bg-indigo-50 text-indigo-600" : "text-gray-800"
              }`
            }
          >
            {option}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
);

const InlineTaskInput = ({ onCancel, onAddTask }) => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [type, setType] = useState("Task");
  const [group, setGroup] = useState("Individual");
  const [repeat, setRepeat] = useState("None");
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const formattedDueDate = format(dueDate, "dd MMM yyyy");

  const handleAdd = async () => {
    const cleanTitle = task.trim();
    const cleanDesc = description.trim();
  
    // 🔐 Kiểm tra dữ liệu người dùng
    if (!cleanTitle) {
      alert("Oops! Please enter a task title 😊");
      return;
    }
  
    try {
      // 🎯 Chuẩn bị dữ liệu gửi lên MongoDB
      const serverTask = {
        title: cleanTitle,
        desc: cleanDesc || "No description", // fallback an toàn
        important: isImportant,
        complete: false,
        due: formattedDueDate,
        overdue: false,
        repeat,
      };
  
      const res = await axios.post("http://localhost:5001/api/v1/create-task", serverTask);
      const mongoTask = res.data.task;
  
      // 📦 Chuẩn bị dữ liệu đầy đủ cho UI
      const newTask = {
        id: mongoTask._id,
        text: mongoTask.title,
        description: mongoTask.desc,
        due: mongoTask.due,
        overdue: mongoTask.overdue,
        important: mongoTask.important,
        status: "In Progress",
        progress: 0,
        type: type.toLowerCase(),
        upcoming: !isSameDay(dueDate, new Date()),
        group: group === "Group",
        repeat,
        time:
          group === "Group" && time && endTime
            ? `${time} – ${endTime}`
            : group === "Group"
            ? time
            : null,
        avatars:
          group === "Group"
            ? Array.from({ length: 4 }, (_, i) => `https://api.dicebear.com/7.x/lorelei/svg?seed=${task}-${i}`)
            : [],
      };
  
      onAddTask(newTask); // đẩy lên UI
  
      // 🧼 Reset form
      setTask("");
      setDescription("");
      setIsImportant(false);
      setType("Task");
      setGroup("Individual");
      setRepeat("None");
      setDueDate(new Date());
      setTime("");
      setEndTime("");
    } catch (err) {
      console.error("❌ Failed to sync with MongoDB", err);
      alert("Something went wrong! Please try again.");
    }
  };
  


  return (
    <div className="mt-6 w-full flex justify-center">
      <div className="w-full max-w-3xl mx-auto px-1 sm:px-0 space-y-4">
        <input
          type="text"
          className="w-full text-base font-semibold placeholder-gray-400 focus:outline-none bg-white px-4 py-2 focus:ring-0 border-none"
          placeholder="Task title"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <input
          type="text"
          className="w-full text-sm text-gray-600 placeholder-gray-400 focus:outline-none bg-white px-4 py-1 focus:ring-0 border-none"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button
              className="flex items-center gap-2 text-sm px-4 py-1.5 rounded-full border border-green-300 bg-green-50 text-green-700 hover:bg-green-100 transition"
              onClick={() => setShowPicker(!showPicker)}
            >
              <FaCalendarAlt /> {formattedDueDate}
            </button>
            {showPicker && (
              <div className="absolute z-50 mt-2 bg-white p-2 rounded-lg shadow-lg">
                <DayPicker
                  mode="single"
                  selected={dueDate}
                  onSelect={(date) => {
                    setDueDate(date);
                    setShowPicker(false);
                  }}
                />
              </div>
            )}
          </div>
          <button
            onClick={() => setIsImportant(!isImportant)}
            className={`flex items-center gap-2 text-sm px-4 py-1.5 rounded-full border transition shadow-sm ${
              isImportant
                ? "border-indigo-300 bg-indigo-50 text-indigo-600"
                : "border-gray-300 text-gray-700 hover:border-indigo-400"
            }`}
          >
            <FaFlag /> Important
          </button>
          <Dropdown selected={group} setSelected={setGroup} options={groupOptions} />
          <Dropdown selected={type} setSelected={setType} options={typeOptions} />
          <Dropdown selected={repeat} setSelected={setRepeat} options={repeatOptions} />
          {group === "Group" && (
            <>
              <input
                type="time"
                className="px-4 py-1.5 border rounded-full text-sm text-gray-700 shadow-sm"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
              <span className="text-sm text-gray-500">—</span>
              <input
                type="time"
                className="px-4 py-1.5 border rounded-full text-sm text-gray-700 shadow-sm"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </>
          )}
          <button className="text-gray-600 text-lg px-2 hover:text-gray-800">
            <FaEllipsisH />
          </button>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiInbox /> Inbox
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-5 py-1.5 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 font-medium shadow transition"
              onClick={handleAdd}
            >
              Add task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineTaskInput;
