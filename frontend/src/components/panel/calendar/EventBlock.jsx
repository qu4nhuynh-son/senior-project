import React from "react";

const EventBlock = ({ event, onClick }) => {
  const keywordIconMap = [
    { keywords: ["call", "phone"], icon: "☎️" },
    { keywords: ["meeting", "client", "zoom"], icon: "👥" },
    { keywords: ["dentist", "doctor", "appointment"], icon: "🦷" },
    { keywords: ["birthday"], icon: "🎂" },
    { keywords: ["presentation", "work", "task"], icon: "💼" },
    { keywords: ["lunch", "dinner", "breakfast"], icon: "🍽️" },
    { keywords: ["gym", "exercise", "workout"], icon: "🏋️" },
    { keywords: ["study", "learn", "class"], icon: "📚" },
    { keywords: ["travel", "flight", "trip"], icon: "✈️" },
  ];

  const getIcon = (text) => {
    const lower = text.toLowerCase();
    for (let entry of keywordIconMap) {
      if (entry.keywords.some((word) => lower.includes(word))) {
        return entry.icon;
      }
    }
    return "📝";
  };

  const title = event.title || "(no title)";
  const icon = getIcon(title);

  return (
    <div
      onClick={onClick}
      className={`w-full px-2 py-1 text-xs rounded-lg cursor-pointer hover:scale-[1.01] hover:shadow transition-all duration-150
        ${event.tagColor || "bg-blue-100"} overflow-hidden`}
    >
      <div className="flex gap-1 items-center font-semibold text-gray-800 text-[13px] leading-snug break-words">
        <span>{icon}</span>
        <span className="whitespace-normal break-words">{title}</span>
      </div>

      {event.description && (
        <div className="text-[11px] text-gray-600 whitespace-normal mt-1">
          {event.description}
        </div>
      )}
    </div>
  );
};

export default EventBlock;
