import React from "react";
import PostTableRow from "./PostTableRow";

const PostsTable = ({posts, onEdit, onDelete}) => {
  return (
    <div className="rounded-xl shadow border border-slate-700 bg-slate-900">
      <div className="flex justify-between p-6 border-b border-slate-700">
        <h2 className="font-semibold text-lg text-white">
          Your Posts
        </h2>
      </div>
      <table className="w-full text-left">
        <thead className="border-b border-slate-700 bg-slate-800">
          <tr>
            <th className="p-4 text-slate-300">Title</th>
            <th className="p-4 text-slate-300">Preview</th>
            <th className="p-4 text-slate-300">Actions</th>
          </tr>
        </thead>
        <tbody className="text-slate-400">
        {posts.length === 0 ? (
          <tr>
            <td colSpan={3} className="p-6 text-center text-slate-400">
              No posts available.
            </td>
          </tr>
        ) : (
          posts.map((post, index) => (
            <PostTableRow 
              key={index} 
              post={post} 
              index={index}
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))
        )}

        </tbody>

      </table>

    </div>

  )
}

export default PostsTable