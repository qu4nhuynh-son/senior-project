import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiX, FiVolume2, FiVolumeX } from "react-icons/fi";
import { FaPlay, FaPause } from "react-icons/fa";
import { Howl } from "howler";
import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


import lofiImg from "../../../images/lofi.jpg";
import rainImg from "../../../images/rain.jpg";
import forestImg from "../../../images/forest.jpg";

const soundOptions = [
  {
    key: "lofi",
    label: "🎵 Lofi",
    image: lofiImg,
  },
  {
    key: "rain",
    label: "🌧️ Rain",
    image: rainImg,
  },
  {
    key: "forest",
    label: "🌲 Forest",
    image: forestImg,
  },
  {
    key: "none",
    label: "🚫 None",
    image: null,
  },
];

const sounds = {
  lofi: "/sounds/lofi.mp3",
  rain: "/sounds/rain.mp3",
  forest: "/sounds/forest.mp3",
  none: null,
};

const FocusMode = ({ task, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSound, setSelectedSound] = useState("lofi");
  const [isMuted, setIsMuted] = useState(false);
  const intervalRef = useRef(null);
  const soundRef = useRef(null);
  const [isBreak, setIsBreak] = useState(false);


  useEffect(() => {
    if (selectedSound && sounds[selectedSound]) {
      soundRef.current = new Howl({
        src: [sounds[selectedSound]],
        loop: true,
        volume: isMuted ? 0 : 0.5,
      });
      soundRef.current.play();
    }
    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [selectedSound]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(isMuted ? 0 : 0.5);
    }
  }, [isMuted]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            if (!isBreak) {
              // 👉 Kết thúc phiên làm việc → sang break
              setIsBreak(true);
              setSecondsLeft(5 * 60); // 5 phút break
              setIsRunning(true);
            } else {
              // 👉 Kết thúc break → quay lại focus
              setIsBreak(false);
              setSecondsLeft(25 * 60);
              setIsRunning(false); // bạn có thể tự cho chạy lại nếu muốn
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const secs = (s % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <FiX size={20} />
        </button>
        <h2 className="text-xl font-bold mb-2">
  {isBreak ? "🧘 Break Time" : "🌙 Focus Mode"}
</h2>

<p className="text-sm text-gray-500 mb-4">
  {isBreak ? "Relax and breathe..." : <>Focusing on: <strong>{task?.text}</strong></>}
</p>


        <div className="w-40 h-40 mx-auto mb-6">
  <CircularProgressbarWithChildren
    value={((25 * 60 - secondsLeft) / (25 * 60)) * 100}
    styles={buildStyles({
      pathColor: "#6366f1",
      trailColor: "#e5e7eb",
    })}
  >
    <div className="text-3xl font-mono">{formatTime(secondsLeft)}</div>
  </CircularProgressbarWithChildren>
</div>


        <div className="flex justify-center items-center gap-4 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-md transition"
          >
            {isRunning ? <FaPause size={20} /> : <FaPlay size={20} />}
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-gray-600 hover:text-gray-800"
          >
            {isMuted ? <FiVolumeX size={22} /> : <FiVolume2 size={22} />}
          </button>
        </div>

        <div className="text-sm text-gray-600 mb-2">Soundscape:</div>
        <div className="grid grid-cols-2 gap-3">
          {soundOptions.map(({ key, label, image }) => (
            <button
              key={key}
              onClick={() => setSelectedSound(key)}
              className={`relative rounded-xl px-2 py-2 text-sm flex items-center gap-2 transition-all duration-200
                ${selectedSound === key
                  ? "border-2 border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-200 ring-2 ring-indigo-200"
                  : "border border-gray-200"}
              `}
              
            >
              {image ? (
                <img
                  src={image}
                  alt={key}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <span className="text-xl">🚫</span>
              )}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FocusMode;
