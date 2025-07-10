import React from "react";
import { FiMoreHorizontal } from "react-icons/fi";
import { FaHeart, FaFire, FaRegThumbsUp } from "react-icons/fa";

const Post = ({ post }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-4 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <img
            src={`https://api.dicebear.com/7.x/micah/svg?seed=${post.username}`}
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold text-sm text-gray-800">{post.username}</p>
            <p className="text-xs text-gray-500">{post.time}</p>
          </div>
        </div>
        <FiMoreHorizontal className="text-gray-400" />
      </div>

      {/* Content */}
      <p className="text-sm text-gray-800 mb-2 whitespace-pre-line">
        {post.content}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt="attached"
          className="w-full h-48 object-cover rounded-lg mb-2"
        />
      )}

      {/* Footer */}
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <FaHeart className="text-red-500" /> {post.reactions.heart || 0}
        </div>
        <div className="flex items-center gap-1">
          <FaRegThumbsUp className="text-yellow-600" /> {post.reactions.clap || 0}
        </div>
        <div className="flex items-center gap-1">
          <FaFire className="text-orange-500" /> {post.reactions.fire || 0}
        </div>
      </div>
    </div>
  );
};

export default Post;
