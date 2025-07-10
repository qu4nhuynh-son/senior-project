import React, { useState, useEffect, useRef } from "react";
import { FiX, FiClock, FiCalendar, FiUser, FiLink } from "react-icons/fi";

const ScheduleModal = ({ selectedDate, defaultHour, onClose, onSave, position }) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(`${defaultHour}:00`);
  const [endTime, setEndTime] = useState(`${defaultHour + 1}:00`);
  const [description, setDescription] = useState("");
  const [guest, setGuest] = useState("");
  const [meetLink, setMeetLink] = useState("https://meet.google.com/dcm-xyz");
  const [tagColor, setTagColor] = useState("bg-blue-200");

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = () => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);
    start.setHours(Number(startTime.split(":")[0]));
    end.setHours(Number(endTime.split(":")[0]));

    onSave({ title, start, end, description, guest, meetLink, tagColor });
    onClose();
  };

  const tagOptions = ["bg-blue-200", "bg-green-200", "bg-yellow-200", "bg-pink-200", "bg-purple-200"];

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute"
        style={{ top: position?.top || 200, left: position?.left || 200 }}
        ref={modalRef}
      >
        <div className="bg-white w-[380px] rounded-xl shadow-xl p-4 space-y-3 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-lg"
          >
            <FiX />
          </button>

          <h2 className="text-base font-semibold">Add Schedule</h2>

          {/* Title */}
          <input
            type="text"
            placeholder="New event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Date */}
          <div className="flex items-center text-sm text-gray-600 px-1">
            <FiCalendar className="mr-2" />
            {selectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>

          {/* Time range */}
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center border rounded px-2 py-1 w-full">
              <FiClock className="mr-2 text-gray-400" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <span>→</span>
            <div className="flex items-center border rounded px-2 py-1 w-full">
              <FiClock className="mr-2 text-gray-400" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
          </div>

          {/* Guest */}
          <div className="flex items-center border rounded px-3 py-2 text-sm text-gray-700">
            <FiUser className="mr-2" />
            <input
              type="text"
              placeholder="Add guest"
              value={guest}
              onChange={(e) => setGuest(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Google Meet link */}
          <div className="flex items-center border rounded px-3 py-2 text-sm text-gray-700">
            <FiLink className="mr-2" />
            <input
              type="text"
              placeholder="Google Meet link"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full outline-none bg-transparent"
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Tag color */}
          <div className="flex items-center gap-2 pt-1 px-1">
            {tagOptions.map((color, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full cursor-pointer border ${color} ${
                  tagColor === color ? "ring-2 ring-offset-1 ring-gray-600" : ""
                }`}
                onClick={() => setTagColor(color)}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-3">
            <button
              onClick={onClose}
              className="text-sm text-gray-600 px-3 py-1.5 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="text-sm px-4 py-1.5 rounded bg-black text-white hover:bg-gray-800"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
