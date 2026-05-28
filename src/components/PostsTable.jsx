import React from "react";
import PostTableRow from "./PostTableRow";

const PostsTable = ({posts, onEdit, onDelete}) => {
  return (

    <div className="rounded-xl shadow ">

      <div className="flex justify-between p-6 border-b">

        <h2 className="font-semibold text-lg">
          Your Posts
        </h2>

      </div>

      <table className="w-full text-left">

        <thead className="border-b bg-gray-50">

          <tr>
            <th className="p-4">Title</th>
            <th className="p-4">Preview</th>
            <th className="p-4">Actions</th>
          </tr>

        </thead>

        <tbody className="text-gray-500">
        {posts.length === 0 ? (
          <tr>
            <td colSpan={3} className="p-6 text-center text-gray-500">
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