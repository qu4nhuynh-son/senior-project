import { useState } from "react";
import { useNavigate } from "react-router-dom";
import chatIcon from "../images/chaticon2.png";
import zentaskIllustration from "../images/zentask-illustration2.png";


const UseCase = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const navigate = useNavigate();

  const handleOptionClick = (option) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  return (
    <div className="flex h-screen relative bg-white">
      {/* Logo và Step Indicator */}
      <div className="absolute top-6 left-6 flex items-center cursor-pointer hover:cursor-pointer hover:opacity-80" onClick={() => navigate("/")}>
        <img src={chatIcon} alt="Zentask Logo" className="w-10 h-10 mr-2" />
        <span className="text-2xl font-bold text-gray-800">Zentask</span>
      </div>
      <div className="absolute top-6 right-6 text-gray-500 text-sm bg-gray-100 px-4 py-2 rounded-lg shadow-md">
        <span className="text-gray-700 font-medium">Step 2 of 2</span>
      </div>

      {/* Main Content */}
      <div className="flex w-full h-full justify-center items-center">
        {/* Left Panel */}
        <div className="w-1/2 flex justify-center">
          <div className="w-96">
            <h1 className="text-2xl font-bold mb-4 text-left">How do you plan to use Zentask?</h1>
            <p className="text-gray-600 mb-6 text-left">Choose all that apply.</p>
            <div className="space-y-4">
              {[
                { label: "Personal", icon: "\uD83D\uDE4B" },
                { label: "Work", icon: "\uD83D\uDCBC" },
                { label: "Education", icon: "\uD83C\uDF93" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer ${selectedOptions.includes(item.label) ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
                  onClick={() => handleOptionClick(item.label)}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="text-lg font-medium text-gray-800 flex-1">{item.label}</span>
                  <span className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${selectedOptions.includes(item.label) ? "border-blue-500" : "border-gray-300"}`}>
                    {selectedOptions.includes(item.label) && <div className="w-3 h-3 bg-blue-500 rounded-full"></div>}
                  </span>
                </div>
              ))}
            </div>
                <button
                className={`mt-6 w-full p-3 text-white font-bold rounded-lg ${
                    selectedOptions.length > 0
                        ? "bg-black hover:bg-gray-800"
                        : "bg-gray-500 cursor-not-allowed" }`}
                disabled={selectedOptions.length === 0}
                onClick={() => {
                    if (selectedOptions.length > 0) {
                      navigate("/dashboard"); // Chuyển hướng sang trang Dashboard
                    }
                  }}
                >
                    Launch Zentask
                </button>

          </div>
        </div>

                {/* Right Panel 
                <div className="w-1/2 flex justify-center items-center bg-[#F8F3ED]">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96 flex flex-col items-center">
          <img src={zentaskIllustration} alt="Zentask Illustration" className="w-full" />
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default UseCase;
