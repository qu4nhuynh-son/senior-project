// src/components/CalendarModal.jsx
import {
    FiUser, FiSettings, FiZap, FiCreditCard, FiLayers, FiSidebar,
    FiCheckSquare, FiTrendingUp, FiClock, FiBell, FiStar, FiLink2, FiCalendar,
  } from "react-icons/fi";
  
  const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_GOOGLE_REDIRECT_URI;

const SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly"
];

const AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPES.join(" ")}&prompt=consent`;


  const CalendarModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-[1000px] h-[600px] shadow-lg flex overflow-hidden relative">
          {/* Left Panel - Settings */}
          <div className="w-1/3 border-r p-4 bg-gray-50 flex flex-col justify-between overflow-y-auto">
            <div>
              <h2 className="font-bold text-lg mb-4">Settings</h2>
              <input
                type="text"
                placeholder="Search"
                className="w-full px-3 py-2 mb-4 border rounded-md text-sm"
              />
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-gray-700"><FiUser /> Account</li>
                <li className="flex items-center gap-2 text-gray-700"><FiSettings /> General</li>
                <li className="flex items-center gap-2 text-gray-700"><FiZap /> Advanced</li>
                <li className="flex items-center gap-2 text-gray-700"><FiCreditCard /> Subscription</li>
                <li className="flex items-center gap-2 text-gray-700"><FiLayers /> Theme</li>
                <li className="flex items-center gap-2 text-gray-700"><FiSidebar /> Sidebar</li>
                <li className="flex items-center gap-2 text-gray-700"><FiCheckSquare /> Quick Add</li>
                <li className="flex items-center gap-2 text-gray-700"><FiTrendingUp /> Productivity</li>
                <li className="flex items-center gap-2 text-gray-700"><FiClock /> Reminders</li>
                <li className="flex items-center gap-2 text-gray-700"><FiBell /> Notifications</li>
                <li className="flex items-center gap-2 text-gray-700"><FiStar /> Backups</li>
                <li className="flex items-center gap-2 text-gray-700"><FiLink2 /> Integrations</li>
                <li className="flex items-center gap-2 text-blue-500 bg-blue-100 font-semibold px-2 py-1 rounded-md"><FiCalendar /> Calendars</li>
              </ul>
            </div>
            <div className="text-sm text-gray-700 mt-4 pl-2">+ Add team</div>
          </div>
  
          {/* Right Panel - Calendar Content */}
          <div className="w-2/3 p-6 overflow-y-auto relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              &times;
            </button>
  
            <h2 className="text-xl font-bold mb-2">Calendars</h2>
            <p className="text-sm text-gray-600 mb-6">
              Show events in Zentask and sync scheduled tasks to your calendar.
            </p>
  
            {/* Connect Button - Blue Pastel theme */}
            <button onClick={() => window.open(AUTH_URL, "_blank")}
             className="bg-blue-200 text-blue-800 px-4 py-2 rounded font-semibold hover:bg-blue-300 mb-6 flex items-center gap-2 shadow-sm">
              <img src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_16_2x.png" className="w-5 h-5" />
              Connect Google Calendar
            </button>
  
            <h3 className="font-semibold text-gray-800 mb-3">What you can do</h3>
            <div className="flex gap-4">
              {/* Left Card */}
              <div className="flex-1 border rounded-md overflow-hidden bg-white">
                <img
                  src="https://d3ptyyxy2at9ui.cloudfront.net/assets/pages/calendar/calendar-v2-events-in-todoist-10102b0e6e993a24ff2b610f1c04d60e.jpg"
                  alt="Events"
                  className="w-full object-cover"
                />
                <div className="p-3 border-t text-sm">
                  <strong>See events in Zentask</strong>
                  <p className="text-gray-500 text-xs mt-1">
                    Events are shown in Today and Upcoming.
                  </p>
                </div>
              </div>
  
              {/* Right Card */}
              <div className="flex-1 border rounded-md overflow-hidden bg-white">
                <img
                  src="https://d3ptyyxy2at9ui.cloudfront.net/assets/pages/calendar/calendar-v2-sync-calendar-849dce52ea5bb4d87d17df54f0f8cb7b.jpg"
                  alt="Sync"
                  className="w-full object-cover"
                />
                <div className="p-3 border-t text-sm">
                  <strong>Sync tasks to calendar</strong>
                  <p className="text-gray-500 text-xs mt-1">
                    Scheduled tasks assigned to you will be synced to a new “Zentask” calendar in your connected account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default CalendarModal;
  