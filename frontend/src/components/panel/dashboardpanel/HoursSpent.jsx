import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "M", hours: 5 },
  { name: "T", hours: 11 },
  { name: "W", hours: 9 },
  { name: "T", hours: 12 },
  { name: "F", hours: 10 },
  { name: "S", hours: 7 },
  { name: "S", hours: 8 },
];

const HoursSpent = () => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm h-[200px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <h2 className="text-base font-semibold text-gray-800">Hours Spent</h2>
        <span className="text-sm text-gray-400">8 h 25 min</span>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d9a7c7" />
              <stop offset="100%" stopColor="#fffcdc" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip wrapperStyle={{ fontSize: "12px" }} />
          <Bar dataKey="hours" fill="url(#tempGradient)" radius={[10, 10, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HoursSpent;
