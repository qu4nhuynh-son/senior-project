import React, { useState } from "react";
import { FaHeart, FaFire, FaRegComment } from "react-icons/fa";
import { BsRocketTakeoffFill } from "react-icons/bs";

const Buddy = () => {
  const [newPost, setNewPost] = useState("");

  const username = "Quan";
  const streakDays = 4;

  const mockPosts = [
    {
      id: "1",
      name: "Quan",
      avatarSeed: "Quan",
      content: "✅ Just completed the task “Prepare Final Report”",
      focusTime: "25 min focus mode",
      streak: "🌙 4 streak days",
      reactions: { heart: 3, muscle: 1, fire: 2 },
      comments: [{ name: "Linh", text: "Cheering you on!" }],
      time: "Just now",
    },
    {
      id: "2",
      name: "Linh",
      avatarSeed: "Linh",
      content: "🔒 Working on Analysis Project",
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?fit=crop&w=500&q=80",
      reactions: { heart: 5, muscle: 3 },
      comments: [{ name: "Quan", text: "Nice work 💪" }],
      time: "1h ago",
    },
  ];

  return (
    <div className="w-full px-10 py-8">
      {/* HEADER ZENTASK FEED */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/micah/svg?seed=${username}`}
            className="w-12 h-12 rounded-full border shadow"
            alt="User avatar"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ZenTask Feed</h1>
            <p className="text-sm text-gray-500">Welcome back, {username}!</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            🌙 <span className="font-semibold">{streakDays}</span> day streak
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            📝 <span className="font-semibold">{mockPosts.length}</span> posts
          </div>
        </div>
      </div>

      {/* POST INPUT BOX */}
      <div className="bg-white rounded-xl shadow p-5 mb-8">
        <textarea
          rows={3}
          placeholder="Share what you've achieved today..."
          className="w-full border rounded-md p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-300 outline-none"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <div className="text-right mt-2">
          <button className="flex items-center justify-center gap-2 bg-indigo-500 text-white px-4 py-1.5 text-sm rounded hover:bg-indigo-600 transition">
            <BsRocketTakeoffFill /> Post
          </button>
        </div>
      </div>

      {/* POSTS LIST */}
      <div className="space-y-6">
        {mockPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow px-5 py-4 space-y-2"
          >
            {/* POST HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${post.avatarSeed}`}
                  alt="avatar"
                  className="w-9 h-9 rounded-full"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{post.name}</p>
                  <p className="text-xs text-gray-400">{post.time}</p>
                </div>
              </div>
              <div className="text-gray-400 text-xl">⋯</div>
            </div>

            {/* POST CONTENT */}
            <p className="text-sm text-gray-800">{post.content}</p>

            {/* FOCUS TIME / STREAK */}
            <div className="text-xs text-gray-500 flex items-center gap-3">
              {post.focusTime && <>🕐 {post.focusTime}</>}
              {post.streak && <>{post.streak}</>}
            </div>

            {/* OPTIONAL IMAGE */}
            {post.image && (
              <img
                src={post.image}
                alt="post"
                className="w-full rounded-md h-44 object-cover"
              />
            )}

            {/* REACTIONS */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              {post.reactions.heart > 0 && (
                <span className="flex items-center gap-1">❤️ {post.reactions.heart}</span>
              )}
              {post.reactions.muscle > 0 && (
                <span className="flex items-center gap-1">💪 {post.reactions.muscle}</span>
              )}
              {post.reactions.fire > 0 && (
                <span className="flex items-center gap-1">🔥 {post.reactions.fire}</span>
              )}
            </div>

            {/* COMMENTS */}
            {post.comments.map((cmt, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                <img
                  src={`https://api.dicebear.com/7.x/micah/svg?seed=${cmt.name}`}
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">{cmt.name}</span>
                <span>{cmt.text}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buddy;
