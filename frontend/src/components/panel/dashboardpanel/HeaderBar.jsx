import { FiBell, FiSearch } from "react-icons/fi";

const HeaderBar = () => {
  return (
    <div className="flex justify-between items-center p-6 bg-gradient-to-r from-sky-100 via-indigo-100 to-purple-100 rounded-2xl shadow-sm">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-indigo-800">Zentask is Fun!</h1>
        <p className="text-sm text-indigo-500 mt-1">Learn and Work anytime, anywhere without time limit!</p>
      </div>

      {/* Search, Notification, Avatar */}
      <div className="flex items-center space-x-4">
        {/* Search Box */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 rounded-xl bg-white text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm border border-gray-200"
          />
          <FiSearch className="absolute top-2.5 left-3 text-gray-400" />
        </div>

        {/* Notification Icon */}
        <button className="relative hover:opacity-80">
          <FiBell className="text-xl text-indigo-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Avatar */}
        <img
          src="https://api.dicebear.com/7.x/micah/svg?seed=ZentaskUser"
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-white shadow"
        />
      </div>
    </div>
  );
};

export default HeaderBar;
