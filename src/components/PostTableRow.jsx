import React from "react";

const PostTableRow = ({ post, index, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4 font-medium">{post.title}</td>

      <td className="p-4 text-gray-600">
        {post.content?.slice(0, 60)}...
      </td>

      <td className="p-4 flex gap-3">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => onEdit(post)}
        >
          Edit
        </button>

        <button
          className="text-red-500 hover:text-red-700"
          onClick={() => onDelete(post)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default PostTableRow;
