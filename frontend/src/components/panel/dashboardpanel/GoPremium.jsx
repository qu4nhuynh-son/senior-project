import React from "react";
import { FaGift } from "react-icons/fa";

const GoPremium = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-100 to-violet-200 text-indigo-700 rounded-2xl p-6 flex flex-col items-center justify-between h-full shadow-sm">
      <div className="text-4xl mb-4 text-indigo-500">
        <FaGift />
      </div>
      <h3 className="text-lg font-bold mb-2">Go premium!</h3>
      <p className="text-sm text-center text-indigo-600 leading-relaxed mb-4">
        Gain access to a range of benefits designed to enhance your user experience
      </p>
      <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full text-sm font-medium transition shadow">
        Find out more
      </button>
    </div>
  );
};

export default GoPremium;
