import React, { useState, useEffect } from "react";
import './Chatbot.css';
import chatbotIcon from '../../images/chaticon2.png';
import toast from "react-hot-toast";


const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Mặc định là thu gọn
  const [stage, setStage] = useState(0);  // 0 = chưa hỏi gì, 1 = đã hỏi tên và email
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });



    // Khi chatbot được mở, tự động gửi lời chào
    useEffect(() => {
      if (!isCollapsed && messages.length === 0) {
        const welcomeMessage = {
          sender: "bot",
          text: "Hello there, I am Baobao, AI assistant of Zentask, How can I help you today?"
        };
        setMessages([welcomeMessage]);
      }
    }, [isCollapsed, messages]);
  
    useEffect(() => {
      const chatContainer = document.getElementById("chat-box");
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, [messages]);
  
    const sendMessage = async () => {
      if (!input.trim()) return;
      const userMessage = { sender: "user", text: input };
      setMessages((messages) => [...messages, userMessage]);
      setLoading(true);
    
      let botMessage;
    
      // Giai đoạn hỏi tên & email
      if (stage === 0) {
        botMessage = {
          sender: "bot",
          text: "Can I know your name, and email address so I can assist you better?",
        };
        setStage(1);
      } else if (stage === 1) {
        // Giai đoạn lưu tên & email
        const [namePart, emailPart] = input.split(",");
        const name = namePart?.trim();
        const email = emailPart?.trim();
    
        if (!name || !email || !email.includes("@")) {
          botMessage = {
            sender: "bot",
            text: "Oops! Please enter in the format: John, john@example.com",
          };
        } else {
          setUserInfo({ name, email });
          botMessage = {
            sender: "bot",
            text: `Oh hey ${name}, welcome back to Zentask! Anything I can help you today?`,
          };
          setStage(2); // tiếp tục với AI motivator
        }
      } else {
        // Giai đoạn trò chuyện chính (AI motivator)
        try {
          const response = await fetch("http://localhost:5001/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: input, name: userInfo.name }),
          });
    
          const data = await response.json();
          if (data.calendarEvents && Array.isArray(data.calendarEvents)) {
            console.log("📌 BaoBao has calendar events to show:", data.calendarEvents);
          
            // Thông báo cho lịch tự cập nhật (real-time)
            window.dispatchEvent(new Event("calendar-updated"));
            // ✅ Show success toast
              toast.success(`📅 "${data.calendarEvents[0]?.title}" added to calendar!`);
            }

            if (data.deleted) {
              // ✅ Remove from localStorage (nếu bạn còn dùng) - tuỳ chọn

              // ✅ Show delete toast
              toast.success("🗑️ Event deleted from calendar");
            }

            if (data.reply.includes("couldn't find") || data.reply.includes("⚠️")) {
              toast.error("⚠️ BaoBao couldn’t process that. Try rephrasing.");
            }
          
          
          
          botMessage = { sender: "bot", text: data.reply };
        } catch (error) {
          botMessage = {
            sender: "bot",
            text: "🚨 Bot is currently unavailable! Please check API key and logs.",
          };
        }
      }
    
      setMessages((messages) => [...messages, botMessage]);
      setInput("");
      setLoading(false);
    };
    
    

  return (
    <div className="chatbot-container">
      {isCollapsed ? (
        <img src={chatbotIcon} className="chatbot-icon" alt="Chatbot" onClick={() => setIsCollapsed(false)} />
      ) : (
        <div className="chat-interface fixed bottom-4 right-4 w-96 shadow-lg rounded-xl bg-white p-4 border">
        <div className="chat-header">
        Chat with Zentask
        <button onClick={() => setIsCollapsed(true)} className="collapse-button">-</button> {/* Dấu gạch ngang */}
        </div>
        <div id="chat-box" className="h-64 overflow-y-auto p-2 border rounded-md">
        {messages.map((msg, i) => (
      <div key={i} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
      {msg.sender === "bot" && (
        <img src={chatbotIcon} alt="Baobao" className="chat-avatar" />
      )}
      <span className={`inline-block px-3 py-1 rounded-lg ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
        {msg.text}
      </span>
    </div>
  ))}
  {loading && <div className="text-center text-gray-400">Bot is responding...</div>}
</div>

          <div className="flex mt-2">
            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
                className="flex-1 border p-2 rounded-l resize-none focus:outline-none"
                placeholder="Typing..."
              />

            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
