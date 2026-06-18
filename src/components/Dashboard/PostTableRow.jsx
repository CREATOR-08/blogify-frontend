import React from "react";

const PostTableRow = ({ post, index, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-slate-700 hover:bg-slate-800 transition">
      <td className="p-4 font-medium text-white">{post.title}</td>
      <td className="p-4 text-slate-400">
        {post.content?.slice(0, 60)}...
      </td>
      <td className="p-4 flex gap-3">
        <button
          className="text-cyan-400 hover:text-cyan-300 transition"
          onClick={() => onEdit(post)}
        >
          Edit
        </button>
        <button
          className="text-red-400 hover:text-red-300 transition"
          onClick={() => onDelete(post)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default PostTableRow;
