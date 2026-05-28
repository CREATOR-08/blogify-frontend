import React from "react";

const Sidebar = () => {
  return (

    <div className="w-64 bg-white shadow-lg">

      <div className="p-6 font-bold text-xl border-b">
        Blogify
      </div>

      <div className="flex flex-col p-6 gap-3">

        <button className="text-left hover:bg-gray-100 p-2 rounded">
          Dashboard
        </button>

        <button className="text-left hover:bg-gray-100 p-2 rounded">
          My Posts
        </button>

        <button className="text-left hover:bg-gray-100 p-2 rounded">
          Create Post
        </button>

        <button className="text-left hover:bg-gray-100 p-2 rounded">
          Settings
        </button>

      </div>

    </div>

  )
}

export default Sidebar