import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaRegCalendarCheck, FaEllipsisH, FaAngleDown, FaAngleRight,
} from "react-icons/fa";

import {FiCheck,
  FiGrid, FiUser, FiPlus, FiSearch, FiCalendar, FiCheckCircle, FiInbox,
} from "react-icons/fi";
import { FaRegCalendarPlus } from "react-icons/fa";

import FeedPage from "../components/panel/feed/FeedPage";
import UpcomingCalendarPage from "../components/panel/calendar/UpcomingCalendarPage";
import TodayContent from "../components/panel/TaskToday/TodayContent";
import CompletedContent from "../components/panel/completed/CompletedContent";

import chatIcon from "../images/chaticon2.png";
import TaskModal from "../components/modal/TaskModal";
import CalendarModal from "../components/modal/CalendarModal";
import ProjectDropdown from "../components/layout/ProjectDropdown";
import InlineTaskInput from "../components/panel/TaskToday/InlineTaskInput";
import DashboardPanel from "../components/panel/dashboardpanel/DashboardPanel";
import InboxChatPanel from "../components/panel/inbox/InboxChatPanel";









const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/v1/get-all-tasks");
      const mongoTasks = res.data.data.map((item) => {
        const dueISO = item.due || new Date().toISOString(); // fallback nếu không có ngày
  
        return {
          id: item._id,
          text: item.title,
          description: item.desc,
          due: dueISO,
          complete: item.complete || false, // ✅ fix chỗ này
          overdue: item.overdue || false,
          important: item.important || false,
          status: "In Progress",
          type: "task",
          upcoming: !dueISO.startsWith(new Date().toISOString().split("T")[0]),
          group: item.group || false,
  
          // 👇 NEW FIELDS cho Dashboard TodayTask UI
          duration: item.duration || "01 h 30 m",
          progress: item.progress || 0,
          members: item.members || Math.floor(Math.random() * 4 + 2), // giả định 2–5 members
        };
      });
  
      setTasks(mongoTasks);
    } catch (err) {
      console.error("❌ Error fetching tasks from MongoDB:", err);
    }
  };  
    useEffect(() => {
    fetchTasks();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [overdueExpanded, setOverdueExpanded] = useState(true);
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [isHoveringProject, setIsHoveringProject] = useState(false);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const userId = localStorage.getItem("userId");

  const [username, setUsername] = useState("");
  // Load tên người dùng từ localStorage khi mở Dashboard
    useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) setUsername(storedName);
  }, []);

  const navigate = useNavigate();
  const toggleOverdue = () => setOverdueExpanded(!overdueExpanded);
  const completeTask = (id) => {
    setTasks((prevTasks) => {
      const completed = prevTasks.find((task) => task.id === id);
      if (completed) {
        completed.completedAt = new Date();
        setCompletedTasks((prev) => [...prev, completed]);
      }
      return prevTasks.filter((task) => task.id !== id);
    });
  };
  
  const projects = [{ name: "Home 🏡", count: 5 }];
  const todayDate = new Date().getDate(); // ví dụ: 26
  const [activeTab, setActiveTab] = useState("dashboard"); // hoặc "completed"
  const [completedTasks, setCompletedTasks] = useState([]);




  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white p-6 border-r relative">
        <div className="flex items-center mb-6">
          <img src={chatIcon} alt="Zentask Logo" className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold">Zentask</span>
        </div>
        <button
          className="flex items-center w-full py-2 px-4 text-blue-500 font-semibold hover:bg-gray-100 rounded"
          onClick={() => setShowModal(true)}
        >
          <FiPlus className="mr-2" /> Add Task
        </button>
        <nav className="mt-6">
          <ul className="space-y-4">
          <li
              className={`flex items-center ${
                activeTab === "dashboard" ? "text-blue-600 font-bold" : "text-gray-700"
              } hover:text-black cursor-pointer`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FiGrid className="mr-3" /> Dashboard
            </li>

                <li
            className={`flex items-center ${
                activeTab === "inbox" ? "text-blue-600 font-bold" : "text-gray-700"
            } hover:text-black cursor-pointer`}
            onClick={() => setActiveTab("inbox")}
            >
            <FiInbox className="mr-3 text-xl" />
            Inbox
            <span className="ml-auto text-gray-400">3</span>
            </li>

            <li
              className={`flex items-center ${
                activeTab === "today" ? "text-blue-600 font-bold" : "text-gray-700"
              } hover:text-black cursor-pointer`}
              onClick={() => setActiveTab("today")}
            >
              <div className="relative mr-3">
                <FiCheck className="text-xl" />
                
              </div>
              Task
              <span className="ml-auto">{tasks.filter((t) => !t.complete).length}</span>
            </li>

        
        <li
          className={`flex items-center ${
            activeTab === "upcoming" ? "text-blue-600 font-bold" : "text-gray-700"
          } hover:text-black cursor-pointer`}
          onClick={() => setActiveTab("upcoming")} >
          <div className="relative mr-3">
            <FiCalendar className="text-xl" />
                <span className="absolute -top-2 -right-2 text-[10px] bg-white text-blue-500 font-bold">
                {todayDate}
                </span>
            </div>
          Schedule
        </li>


            <li
            className={`flex items-center text-gray-700 hover:text-black cursor-pointer ${
            activeTab === "completed" ? "text-blue-600 font-bold" : ""
             }`}
                onClick={() => {
             setActiveTab("completed");
            }}
            >
            <FiCheckCircle className="mr-3" /> Completed
            </li>
            

            <li
  className={`flex items-center ${
    activeTab === "feed" ? "text-blue-600 font-bold" : "text-gray-700"
  } hover:text-black cursor-pointer`}
  onClick={() => setActiveTab("feed")}
>
  <FiUser className="mr-3" /> Buddy
</li>
          </ul>


          {/* My Projects Section */}
          <div className="mt-8">
            <div
              className="flex items-center justify-between text-gray-800 font-semibold px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
              onMouseEnter={() => setIsHoveringProject(true)}
              onMouseLeave={() => setIsHoveringProject(false)}
            >
              <span>My Projects</span>
              <div className="flex items-center gap-2">
                {isHoveringProject && (
                  <button className="text-gray-500 hover:text-gray-700">+</button>
                )}
                <button className="text-gray-500 hover:text-gray-700">&#9660;</button>
              </div>
            </div>
            <ul className="mt-2 pl-2 space-y-1">
              {projects.map((project, index) => (
                <ProjectDropdown
                  key={index}
                  count={project.count}
                  projectName={project.name}
                />
              ))}
            </ul>
            
          </div>
        </nav>
      {/* User Info at Bottom */}
<div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
    <img
    src={`https://api.dicebear.com/7.x/micah/svg?seed=${username}`}
    alt="User Avatar"
    className="w-10 h-10 rounded-full"
    />

  <div className="flex flex-col">
    <div className="flex items-center space-x-1">
    <p className="text-sm font-semibold text-gray-800">{username || "User"}</p>
      <span className="text-xs text-gray-500">&#9662;</span>
    </div>
    <p className="text-xs text-gray-500">Basic Plan</p>
  </div>
</div>

      </aside>

      {/* Main Content */}
      
      <main className="flex-1 p-8 relative">
      {activeTab === "dashboard" && (
        <DashboardPanel tasks={tasks}/> )}

      {activeTab === "today" && (
    <TodayContent
      tasks={tasks}
      completeTask={completeTask}
      overdueExpanded={overdueExpanded}
      toggleOverdue={toggleOverdue}
      addingTask={addingTask}
      InlineTaskInput={InlineTaskInput}
      setAddingTask={setAddingTask}
      setTasks={setTasks} 
      onConnectCalendar={() => setShowCalendarModal(true)}
      fetchTasks={fetchTasks} 
      userId={userId}
    />
  )}

    {activeTab === "completed" && (
      <CompletedContent completedTasks={completedTasks} />
    )}
    {activeTab === "upcoming" && (
      <UpcomingCalendarPage />
      )}
    {activeTab === "completed" && (
    <CompletedContent completedTasks={completedTasks} />
    )}
    {activeTab === "inbox" && (
  <InboxChatPanel />
    )}
    {activeTab === "feed" && <FeedPage />}

</main>

      {/* Modals */}
      {showModal && (
        <TaskModal
          onClose={() => setShowModal(false)}
          onAddTask={(newTask) => setTasks([...tasks, newTask])}
        />
      )}
      {showCalendarModal && <CalendarModal onClose={() => setShowCalendarModal(false)} />}
    </div>
  );
};

export default Dashboard;
