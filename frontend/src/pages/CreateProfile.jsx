import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import chatIcon from "../images/chaticon2.png";

const CreateProfile = () => {
  const [name, setName] = useState("");
  const [useWithTeam, setUseWithTeam] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra nếu user đã có profile
    const checkProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/v1/user/profile", {
          params: { id: localStorage.getItem("id") },
        });
        if (response.data.hasProfile) {
          navigate("/dashboard"); // Chuyển hướng nếu đã có profile
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };
    checkProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:5001/api/v1/user/profile", {id: localStorage.getItem("id"), name, useWithTeam });

        // 👉 Lưu tên vào localStorage
        localStorage.setItem("username", name);
      navigate("/use-case"); // Chuyển hướng sau khi tạo hồ sơ
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <div className="flex h-screen relative bg-white">
      {/* Logo và Step Indicator */}
      <div className="absolute top-6 left-6 flex items-center cursor-pointer hover:cursor-pointer hover:opacity-80" onClick={() => navigate("/")}>
        <img src={chatIcon} alt="Zentask Logo" className="w-10 h-10 mr-2" />
        <span className="text-2xl font-bold text-gray-800">Zentask</span>
      </div>
      <div className="absolute top-6 right-6 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-lg">
        Step 1 of 2
      </div>

      {/* Main Content */}
      <div className="flex w-full h-full justify-center items-center">
        {/* Left Panel */}
        <div className="w-1/2 flex justify-center">
          <div className="w-96">
            <h1 className="text-3xl font-bold mb-6">Create your profile</h1>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-1">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 25)) // Giới hạn 25 ký tự
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter your name"
                  required
                />
                
             {/* Hiển thị bộ đếm ký tự */}
             <div className="text-right text-gray-500 text-sm mt-1">
                  {name.length}/25
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="mb-6 flex items-center justify-between">
                <label className="text-gray-700 font-medium">
                  I want to use Zentask with my team
                </label>
                <div
                  className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
                    useWithTeam ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setUseWithTeam(!useWithTeam)}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transition-all ${
                      useWithTeam ? "translate-x-6" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white text-lg font-semibold p-3 rounded-lg hover:bg-gray-800"
              >
                Continue
              </button>
            </form>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 flex justify-center items-center bg-beige">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-lg font-bold">Your Productivity</h2>
            <div className="flex gap-2 mt-2">
              <button className="px-2 py-1 text-sm border rounded">Daily</button>
              <button className="px-2 py-1 text-sm border rounded">Weekly</button>
              <button className="px-2 py-1 text-sm border rounded">Karma</button>
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm">Completed in the last 7 days</p>
              <div className="w-40 h-2 bg-gray-300 rounded mt-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;
