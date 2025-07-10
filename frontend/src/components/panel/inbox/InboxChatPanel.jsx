import React, { useState, useEffect, useRef } from "react";
import { FiSend, FiMessageCircle, FiPaperclip, FiSmile } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";
import { motion } from "framer-motion";

const dummyTasks = [
  { id: "1", text: "Design Homepage", group: true },
  { id: "2", text: "Marketing Campaign", group: true },
];

const dummyMessages = {
  "1": [
    {
      sender: "Alice",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Alice",
      content: "I just updated the homepage design!",
      time: "10:30 AM",
    },
    {
      sender: "Bob",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=Bob",
      content: "Looks great 👌",
      time: "10:34 AM",
    },
  ],
  "2": [],
};

const InboxChatPanel = () => {
  const [selectedTaskId, setSelectedTaskId] = useState(dummyTasks[0]?.id);
  const [messages, setMessages] = useState(dummyMessages);
  const [newMessage, setNewMessage] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef();

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = {
      sender: "You",
      avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=You",
      content: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedTaskId]: [...(prev[selectedTaskId] || []), newMsg],
    }));
    setNewMessage("");
    setShowEmoji(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) alert(`📎 Uploaded: ${file.name}`);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedTaskId]);

  const filteredMessages = (messages[selectedTaskId] || []).filter((msg) =>
    msg.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full w-full overflow-hidden bg-white">
      {/* Task List */}
      <div className="min-w-[180px] max-w-[200px] w-[18%] bg-gray-50 pl-0 pr-7 py-4 border-r">

        <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-600">
          <FiMessageCircle /> Group Tasks
        </h2>
        <ul className="space-y-3">
          {dummyTasks.map((task) => (
            <li
              key={task.id}
              onClick={() => setSelectedTaskId(task.id)}
              className={`cursor-pointer p-2 rounded-lg text-sm transition ${
                selectedTaskId === task.id
                  ? "bg-indigo-100 text-indigo-700 font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              {task.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {dummyTasks.find((t) => t.id === selectedTaskId)?.text}
          </h3>
          <p className="text-sm text-gray-500">Group discussion</p>
          <div className="flex items-center space-x-1 mt-2">
            {[1, 2, 3].map((i) => (
              <img
                key={i}
                src={`https://api.dicebear.com/7.x/lorelei/svg?seed=user${i}`}
                alt=""
                className="w-6 h-6 rounded-full border"
              />
            ))}
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full mt-3 px-3 py-2 border rounded-md text-sm"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
          {filteredMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-3 items-start ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender !== "You" && (
                <div className="relative">
                  <img src={msg.avatar} alt={msg.sender} className="w-9 h-9 rounded-full border" />
                  <span className="absolute bottom-0 right-0 bg-green-500 w-2 h-2 rounded-full border-2 border-white" />
                </div>
              )}
              <div>
                <div
                  className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "You"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="font-semibold">{msg.sender}</div>
                  <p className="mt-0.5">{msg.content}</p>
                </div>
                <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="relative border-t px-6 py-4 pr-[90px] flex items-center gap-3 bg-white">
          <label className="cursor-pointer">
            <input type="file" hidden onChange={handleFileUpload} />
            <FiPaperclip className="text-gray-500 hover:text-gray-700" />
          </label>
          <button onClick={() => setShowEmoji((prev) => !prev)}>
            <FiSmile className="text-gray-500 hover:text-yellow-500" />
          </button>
          {showEmoji && (
            <div className="absolute bottom-16 right-8 z-50">
              <EmojiPicker onEmojiClick={(e, emoji) => setNewMessage((m) => m + emoji.emoji)} />
            </div>
          )}
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border rounded-full text-sm outline-none"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxChatPanel;
